import slugify from 'slugify';
import Post from '../models/Post.js';

const formatPost = (post) => ({
  id: post._id,
  title: post.title,
  slug: post.slug,
  description: post.description,
  content: post.content,
  image: post.image,
  author: post.author
    ? {
        id: post.author._id,
        name: post.author.name,
        email: post.author.email,
      }
    : null,
  status: post.status,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const getPosts = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    } else if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: posts.map(formatPost),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: formatPost(post) });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, description, content, image, status } = req.body;

    let slug = slugify(title, { lower: true, strict: true });
    const existingSlug = await Post.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await Post.create({
      title,
      slug,
      description,
      content,
      image: image || '',
      author: req.user._id,
      status: status || 'draft',
    });

    await post.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: formatPost(post),
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { title, description, content, image, status } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (content) post.content = content;
    if (image !== undefined) post.image = image;
    if (status) post.status = status;

    await post.save();
    await post.populate('author', 'name email');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: formatPost(post),
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getRelatedPosts = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const related = await Post.find({
      _id: { $ne: post._id },
      status: 'published',
    })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({ success: true, data: related.map(formatPost) });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const User = (await import('../models/User.js')).default;

    const [totalUsers, totalPosts, publishedPosts, draftPosts, recentPosts, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        Post.countDocuments({ status: 'published' }),
        Post.countDocuments({ status: 'draft' }),
        Post.find()
          .populate('author', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
        User.find().sort({ createdAt: -1 }).limit(5),
      ]);

    const activities = [
      ...recentPosts.map((p) => ({
        type: 'post',
        message: `Post "${p.title}" was ${p.status === 'published' ? 'published' : 'created as draft'}`,
        date: p.createdAt,
      })),
      ...recentUsers.map((u) => ({
        type: 'user',
        message: `User "${u.name}" registered`,
        date: u.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        publishedPosts,
        draftPosts,
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

import { useState, useEffect, useCallback } from 'react';
import { postsAPI, uploadAPI } from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { Input, Textarea, Select, ImageUpload } from '../../components/Form';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    status: 'draft',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await postsAPI.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: '', description: '', content: '', image: '', status: 'draft' });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      description: post.description,
      content: post.content,
      image: post.image || '',
      status: post.status,
    });
    setImageFile(null);
    setImagePreview(post.image || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      let imageUrl = form.image;
      if (imageFile) {
        const { data } = await uploadAPI.uploadImage(imageFile);
        imageUrl = data.data.url;
      }

      const payload = { ...form, image: imageUrl };

      if (editingPost) {
        await postsAPI.update(editingPost.id, payload);
      } else {
        await postsAPI.create(payload);
      }
      setModalOpen(false);
      fetchPosts(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsAPI.delete(id);
      fetchPosts(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await postsAPI.update(post.id, { status: newStatus });
      fetchPosts(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Posts Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Create Post
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button className="btn btn-secondary" onClick={() => fetchPosts(1)}>
          Filter
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : (
        <div className="card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.author?.name || '—'}</td>
                  <td>
                    <span className={`badge badge-${post.status}`}>{post.status}</span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(post)}>
                        Edit
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(post)}>
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={fetchPosts}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPost ? 'Edit Post' : 'Create Post'}
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSave}>
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Textarea
            label="Content"
            name="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
            required
          />
          <ImageUpload
            label="Image"
            preview={imagePreview}
            onChange={handleImageChange}
          />
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
          <div className="actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Posts;

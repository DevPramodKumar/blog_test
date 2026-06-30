const Input = ({ label, error, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={props.id || props.name}>{label}</label>}
    <input {...props} />
    {error && <p className="form-error">{error}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={props.id || props.name}>{label}</label>}
    <textarea rows={4} {...props} />
    {error && <p className="form-error">{error}</p>}
  </div>
);

const Select = ({ label, error, options, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={props.id || props.name}>{label}</label>}
    <select {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="form-error">{error}</p>}
  </div>
);

const ImageUpload = ({ label, preview, onChange, error, accept = 'image/jpeg,image/png,image/gif,image/webp' }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <input type="file" accept={accept} onChange={onChange} className="file-input" />
    {preview && (
      <div className="image-preview-wrap">
        <img src={preview} alt="Preview" className="image-preview" />
      </div>
    )}
    {error && <p className="form-error">{error}</p>}
  </div>
);

export { Input, Textarea, Select, ImageUpload };

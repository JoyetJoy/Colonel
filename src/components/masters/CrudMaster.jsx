import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorPopup from '../popups/ErrorPopup';
import DeleteConfirmationPopup from '../popups/DeleteConfirmationPopup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { DataTable } from "../ui/DataTable";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'align',
  'blockquote',
];

export function CrudMaster({
  title, columns, api, data, loader, isLoading, isError, keyword, setKeyword, queryKey, formFields, onSave, onView, renderViewActions,
  pagination = false, currentPage = 1, totalPages = 1, totalItems = 0, onPageChange
}) {
  const hasRichText = formFields.some(f => f.type === 'richtext');
  const hasManyFields = formFields.length > 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const filteredData = (data || []).filter(item =>
    columns.some(col => String(item[col.key] || '').toLowerCase().includes((keyword || '').toLowerCase()))
  );

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onSave(formData, editingItem?.id);
      if (success !== false) {
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <ErrorPopup
        popupOpen={errorPopup}
        setPopupOpen={setErrorPopup}
        setError={setErrormsg}
        error={errormsg}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add {title}
        </button>
      </div>

      <div className=" flex-1 flex flex-col overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/20"
            />
          </div>
          {/* <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:text-white border border-border transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button> */}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm font-medium">Loading {title.toLowerCase()}...</p>
            </div>
          ) : isError ? (
            <div className="p-8">
              <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium text-sm">Failed to load {title.toLowerCase()}.</p>
              </div>
            </div>
          ) : (
            <DataTable
              columns={[
                ...columns.map(col => ({
                  header: col.label,
                  key: col.key,
                  render: col.render
                })),
                {
                  header: "Actions",
                  accessor: (item) => (
                    <div className="flex items-center gap-2 text-xs">
                      {onView ? (
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#dee8ff] hover:bg-blue-200 transition-colors"
                          title="View"
                        >
                          <Eye className="size-3" color="#487fff" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#dee8ff] hover:bg-blue-200 transition-colors"
                          title="View"
                        >
                          <Eye className="size-3" color="#487fff" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#ddf1e4] hover:bg-green-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="size-3" color="#45b369" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-[#ffe2e2] hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-3" color="#e63946" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={pagination ? data : filteredData}
              pagination={pagination}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`bg-white rounded-xl shadow-lg w-full ${hasRichText ? 'max-w-2xl' : hasManyFields ? 'max-w-3xl' : 'max-w-md'} overflow-hidden animate-in fade-in zoom-in duration-200`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingItem ? 'Edit' : 'Add'} {title}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className={hasManyFields ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
                {formFields.map(field => (
                  <div key={field.name} className={`flex flex-col text-black gap-1.5 ${hasManyFields && (field.type === 'textarea' || field.type === 'richtext') ? 'sm:col-span-2' : ''}`}>
                    <label className="text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'richtext' ? (
                      <div className="crud-quill-wrapper">
                        <ReactQuill
                          theme="snow"
                          value={formData[field.name] || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-shadow resize-none"
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white transition-shadow"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={!!formData[field.name]}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900" />
                        <span className="ml-2.5 text-sm text-gray-600">{formData[field.name] ? 'Yes' : 'No'}</span>
                      </label>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-shadow"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 w-full text-sm cursor-pointer font-medium text-gray-700 bg-white border cursor-pointer border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loader}
                  className="px-4 py-2 w-full text-sm cursor-pointer flex justify-center items-center font-medium text-white bg-black rounded-sm cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors shadow-sm"
                >
                  {loader ? <div className="w-4 h-4 border-2  border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationPopup
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        api={api}
        itemId={itemToDelete}
        queryKey={queryKey}
        title={`Delete ${title}`}
        message={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
      />

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`bg-white rounded-xl shadow-lg w-full ${hasManyFields ? 'max-w-3xl' : 'max-w-lg'} overflow-hidden animate-in fade-in zoom-in duration-200`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                View {title}
              </h2>
              <button
                onClick={() => setViewingItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-5 ${hasManyFields ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4' : 'space-y-4'} max-h-[70vh] overflow-y-auto`}>
              {formFields.map(field => {
                let displayValue = viewingItem[field.name];

                if (field.type === 'select') {
                  const opt = field.options?.find(o => String(o.value) === String(displayValue));
                  displayValue = opt?.label || displayValue || '—';
                } else if (field.type === 'checkbox') {
                  displayValue = displayValue ? '✅ Yes' : '❌ No';
                } else {
                  displayValue = displayValue || '—';
                }

                return (
                  <div key={field.name} className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{field.label}</span>
                    <span className="text-sm text-gray-800 font-medium">{displayValue}</span>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              {renderViewActions && renderViewActions(viewingItem)}
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

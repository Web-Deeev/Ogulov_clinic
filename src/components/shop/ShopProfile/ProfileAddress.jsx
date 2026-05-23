import React, { useContext, useState } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

export default function ProfileAddresses() {
  // Достаем профиль и функцию его обновления из глобального контекста
  const { userProfile, setUserProfile } = useContext(ShopContext);

  // Локальные стейты для управления режимом редактирования и добавления
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Стейты для контролируемых форм ввода
  const [mainAddressInput, setMainAddressInput] = useState(userProfile?.address || '');
  const [newAddressInput, setNewAddressInput] = useState('');

  // Временный массив дополнительных адресов (имитация для фронта, сохраняется в сессию)
  const [additionalAddresses, setAdditionalAddresses] = useState(() => {
    const saved = localStorage.getItem('ogulov_additional_addresses');
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Сохранение основного адреса в профиль
  const handleSaveMainAddress = (e) => {
    e.preventDefault();
    if (!mainAddressInput.trim()) return alert("Адрес не может быть пустым!");

    if (setUserProfile) {
      setUserProfile(prev => ({
        ...prev,
        address: mainAddressInput.trim()
      }));
    }
    setIsEditingMain(false);
  };

  // 2. Добавление нового дополнительного адреса
  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return alert("Введите текст адреса!");

    const updatedList = [...additionalAddresses, newAddressInput.trim()];
    setAdditionalAddresses(updatedList);
    localStorage.setItem('ogulov_additional_addresses', JSON.stringify(updatedList));
    
    setNewAddressInput('');
    setIsAddingNew(false);
  };

  // 3. Удаление дополнительного адреса
  const handleDeleteAddress = (index) => {
    const updatedList = additionalAddresses.filter((_, i) => i !== index);
    setAdditionalAddresses(updatedList);
    localStorage.setItem('ogulov_additional_addresses', JSON.stringify(updatedList));
  };

  return (
    <div>
      <h4 className="fw-bold text-dark mb-3">Сохранённые адреса</h4>
      <p className="text-muted small mb-4">Данные используются для автоматического заполнения полей при оформлении заказа.</p>
      
      <div className="row g-3">
        {/* КАРТОЧКА 1: ОСНОВНОЙ АДРЕС ПРОФИЛЯ */}
        <div className="col-12 col-md-6">
          <div className="p-3 rounded-3 border border-secondary-subtle bg-light h-100 position-relative d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-secondary text-white rounded-1 fw-normal">Основной</span>
                {!isEditingMain && (
                  <button 
                    className="btn btn-sm btn-link p-0 text-success text-decoration-none fw-semibold shadow-none"
                    onClick={() => {
                      setMainAddressInput(userProfile?.address || '');
                      setIsEditingMain(true);
                    }}
                  >
                    ✏️ Изменить
                  </button>
                )}
              </div>

              {isEditingMain ? (
                /* Форма редактирования основного адреса */
                <form onSubmit={handleSaveMainAddress} className="mt-2">
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-1">г. Бишкек, улица, дом, квартира</label>
                    <textarea 
                      className="form-control form-control-sm border-secondary-subtle"
                      rows="2"
                      value={mainAddressInput}
                      onChange={(e) => setMainAddressInput(e.target.value)}
                      placeholder="Введите ваш адрес"
                      autoFocus
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-sm btn-success px-2 py-1 small rounded-2 fw-semibold">Сохранить</button>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-secondary px-2 py-1 small rounded-2"
                      onClick={() => setIsEditingMain(false)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                /* Обычный вывод основного адреса */
                <>
                  <h6 className="fw-bold text-dark mb-1">г. Бишкек</h6>
                  <p className="text-muted small mb-0">{userProfile?.address || 'Адрес не указан в профиле'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ДИНАМИЧЕСКИЙ ВЫВОД ДОПОЛНИТЕЛЬНЫХ АДРЕСОВ */}
        {additionalAddresses.map((addr, index) => (
          <div className="col-12 col-md-6" key={index}>
            <div className="p-3 rounded-3 border border-light-subtle bg-white h-100 position-relative d-flex flex-column justify-content-between shadow-sm">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-light text-secondary border border-light-subtle rounded-1 fw-normal">Дополнительный</span>
                  <button 
                    className="btn btn-sm btn-link p-0 text-danger text-decoration-none shadow-none"
                    title="Удалить адрес"
                    onClick={() => handleDeleteAddress(index)}
                  >
                    🗑️
                  </button>
                </div>
                <h6 className="fw-bold text-dark mb-1">Адрес #{index + 2}</h6>
                <p className="text-muted small mb-0">{addr}</p>
              </div>
            </div>
          </div>
        ))}

        {/* КАРТОЧКА ДЛЯ ДОБАВЛЕНИЯ НОВОГО АДРЕСА */}
        <div className="col-12 col-md-6">
          <div className="p-3 rounded-3 border bg-transparent h-100 d-flex align-items-center justify-content-center" style={{ borderStyle: 'dashed', borderColor: '#dee2e6', minHeight: '115px' }}>
            {isAddingNew ? (
              /* Форма ввода нового адреса */
              <form onSubmit={handleAddNewAddress} className="w-100 p-1">
                <div className="mb-2">
                  <input 
                    type="text"
                    className="form-control form-control-sm border-secondary-subtle"
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="Город, улица, дом..."
                    autoFocus
                    required
                  />
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <button type="submit" className="btn btn-sm btn-dark px-2 py-1 rounded-2 fw-semibold">Добавить</button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary px-2 py-1 rounded-2"
                    onClick={() => setIsAddingNew(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              /* Кнопка открытия формы */
              <button 
                className="btn btn-link text-decoration-none text-secondary fw-semibold small shadow-none border-0 w-100 h-100 d-flex align-items-center justify-content-center"
                onClick={() => setIsAddingNew(true)}
              >
                ➕ Добавить адрес
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

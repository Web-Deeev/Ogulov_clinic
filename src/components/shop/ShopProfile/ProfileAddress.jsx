import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import shopService from '@/api/shop';

export default function ProfileAddresses() {
  const { userProfile, setUserProfile } = useContext(ShopContext);

  const [isEditingMain, setIsEditingMain] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const [mainAddressInput, setMainAddressInput] = useState('');
  const [newAddressInput, setNewAddressInput] = useState('');

  const [additionalAddresses, setAdditionalAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('ogulov_additional_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    if (apiSuccess || apiError) {
      const timer = setTimeout(() => { setApiSuccess(null); setApiError(null); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess, apiError]);

  useEffect(() => {
    if (userProfile?.address) {
      setMainAddressInput(userProfile.address);
    }
  }, [userProfile]);

  // 🌐 Железобетонная синхронизация основного адреса с базой клиники
  const handleSaveMainAddress = async (e) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    const cleanAddress = mainAddressInput.trim();
    if (!cleanAddress) {
      setApiError("Адрес не может быть пустым.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Отправляем запрос на сервер Django
      const response = await shopService.updateUserProfile({
        address: cleanAddress
      });

      // Достаем адрес, который вернул бэкенд
      const serverAddress = response?.data?.user?.address || response?.data?.address || cleanAddress;

      // 🔥 КРИТИЧЕСКИЙ ФИКС: Обновляем глобальный контекст, чтобы автозаполнение в Чекауте сразу увидело адрес!
      if (setUserProfile) {
        setUserProfile(prev => ({
          ...prev,
          address: serverAddress
        }));
      }

      setApiSuccess("Основной адрес успешно сохранен в базе данных.");
      setIsEditingMain(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Не удалось сохранить адрес на сервере.";
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    const cleanNew = newAddressInput.trim();
    if (!cleanNew) return;
    const updated = [...additionalAddresses, cleanNew];
    setAdditionalAddresses(updated);
    localStorage.setItem('ogulov_additional_addresses', JSON.stringify(updated));
    setNewAddressInput('');
    setIsAddingNew(false);
    setApiSuccess("Дополнительный адрес добавлен.");
  };

  const handleDeleteAddress = (index) => {
    const updated = additionalAddresses.filter((_, i) => i !== index);
    setAdditionalAddresses(updated);
    localStorage.setItem('ogulov_additional_addresses', JSON.stringify(updated));
    setApiSuccess("Адрес удален.");
  };

  return (
    <div className="profile-addresses-container">
      <h4 className="fw-bold text-dark mb-3">Сохранённые адреса</h4>
      <p className="text-muted small mb-4">Данные используются для автозаполнения полей при оформлении заказа.</p>
      
      {apiError && <div className="alert alert-danger py-2 small mb-3">{apiError}</div>}
      {apiSuccess && <div className="alert alert-success py-2 small mb-3">{apiSuccess}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="p-3 rounded-3 border border-secondary-subtle bg-light h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-secondary text-white rounded-1 fw-normal">Основной</span>
                {!isEditingMain && (
                  <button className="btn btn-sm btn-link p-0 text-success text-decoration-none fw-semibold shadow-none" onClick={() => setIsEditingMain(true)}>
                    ✏️ Изменить
                  </button>
                )}
              </div>

              {isEditingMain ? (
                <form onSubmit={handleSaveMainAddress} className="mt-2">
                  <div className="mb-2">
                    <textarea 
                      className="form-control form-control-sm border-secondary-subtle shadow-none"
                      rows="2"
                      value={mainAddressInput}
                      onChange={(e) => setMainAddressInput(e.target.value)}
                      placeholder="г. Бишкек, ул. Ибраимова, д. 115..."
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-sm btn-success px-2 py-1 rounded-2 fw-semibold" disabled={isSubmitting}>
                      {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary px-2 py-1 rounded-2" onClick={() => setIsEditingMain(false)} disabled={isSubmitting}>
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h6 className="fw-bold text-dark mb-1">Адрес профиля</h6>
                  <p className="text-muted small mb-0">{userProfile?.address || 'Адрес не указан в профиле'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {additionalAddresses.map((addr, index) => (
          <div className="col-12 col-md-6" key={index}>
            <div className="p-3 rounded-3 border border-light-subtle bg-white h-100 d-flex flex-column justify-content-between shadow-sm">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-light text-secondary border border-light-subtle rounded-1 fw-normal">Дополнительный</span>
                  <button className="btn btn-sm btn-link p-0 text-danger text-decoration-none shadow-none" onClick={() => handleDeleteAddress(index)}>
                    🗑️
                  </button>
                </div>
                <h6 className="fw-bold text-dark mb-1">Адрес #{index + 2}</h6>
                <p className="text-muted small mb-0">{addr}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="col-12 col-md-6">
          <div className="p-3 rounded-3 border bg-transparent h-100 d-flex align-items-center justify-content-center" style={{ borderStyle: 'dashed', borderColor: '#dee2e6', minHeight: '115px' }}>
            {isAddingNew ? (
              <form onSubmit={handleAddNewAddress} className="w-100 p-1">
                <div className="mb-2">
                  <input 
                    type="text"
                    className="form-control form-control-sm border-secondary-subtle shadow-none"
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="Город, улица, дом..."
                    autoFocus
                    required
                  />
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <button type="submit" className="btn btn-sm btn-dark px-2 py-1 rounded-2 fw-semibold">Добавить</button>
                  <button type="button" className="btn btn-sm btn-outline-secondary px-2 py-1 rounded-2" onClick={() => setIsAddingNew(false)}>
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <button className="btn btn-sm btn-outline-secondary shadow-none border-0 fw-semibold" onClick={() => setIsAddingNew(true)}>
                ➕ Добавить адрес
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

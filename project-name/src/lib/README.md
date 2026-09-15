# 📦 Lib Qovluğu (`src/lib`)

### Nə üçün istifadə olunur?
Xarici 3-cü tərəf (third-party) kitabxanaları və ya servisləri proqrama inteqrasiya etmək üçün istifadə olunur.

### Nümunələr:
- **`email.service.ts`**: E-poçt göndərmə xidməti (Nodemailer, SendGrid simulyasiyası).
- SMS göndərmə inteqrasiyaları.
- Ödəniş sistemləri (Stripe, PayPal).

### Niyə ayrılır?
Kodu modulyar saxlamaq üçün. Sabah e-poçt provayderinizi dəyişdikdə yalnız bu papakadakı kodu günclləyirsiniz.

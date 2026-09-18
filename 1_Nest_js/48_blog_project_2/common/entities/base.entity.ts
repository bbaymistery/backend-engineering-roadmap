/**
 * ============================================================================
 * 🏗️ BAZA ENTİTY SİNFİ: BaseEntity
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Verilənlər bazasındakı bütün cədvəllər/obyektlər (məsələn: User, Post, Comment)
 * adətən id, yaradılma tarixi (createdAt) və yenilənmə tarixi (updatedAt) kimi
 * eyni sahələrə (fields) sahib olur.
 * 
 * `BaseEntity` abstract (mücərrəd) sinif olduğu üçün birbaşa obyekt kimi yaradıla bilməz,
 * lakin digər bütöv Entity sinifləri (User, Post və s.) bundan miras (`extends BaseEntity`) alaraq
 * koda təkrarçılığın (DRY prinsipi) qarşısını alır.
 */
export abstract class BaseEntity {
  // Unikal identifikasiya nömrəsi / ID
  id: string;

  // Obyektin bazada yaradıldığı tarix
  createdAt: Date;

  // Obyektin sonuncu dəfə yeniləndiyi tarix
  updatedAt: Date;

  /**
   * Konstruktor: Yeni obyekt yaradılarkən işə düşür.
   * @param partial Obyektin sahələrinin bir hissəsini və ya hamısını qəbul edir.
   */
  constructor(partial: Partial<BaseEntity>) {
    // 1. Ötürülən dəyərləri bu obyektin üzərinə kopyalayır
    Object.assign(this, partial);

    // 2. Əgər createdAt verilməyibsə, cari tarixi mənimsədir
    this.createdAt = this.createdAt || new Date();

    // 3. Yenilənmə tarixini cari vaxta təyin edir
    this.updatedAt = new Date();
  }
}


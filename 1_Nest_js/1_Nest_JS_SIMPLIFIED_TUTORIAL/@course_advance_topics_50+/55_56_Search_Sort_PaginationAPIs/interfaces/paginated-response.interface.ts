export interface PaginationMeta {
  totalItems: number;   // Ümumi bütün tapılan bazadakı element sayı (məs: 100)
  itemCount: number;    // Cari səhifədə qaytarılan element sayı (məs: 10)
  itemsPerPage: number; // Səhifə başına təyin olunan limit (məs: 10)
  totalPages: number;   // Yekun neçə səhifə var (məs: 10)
  currentPage: number;  // Hansı səhifədəyik (məs: 1)
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

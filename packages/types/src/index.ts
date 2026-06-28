export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  role: 'ADMIN' | 'USER';
}

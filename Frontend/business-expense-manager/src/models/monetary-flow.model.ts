export interface MonetaryFlow {
  id?: number;
  businessId?: number;
  goal?: string | null;
  category?: string;
  monetaryValue?: number;
  createdDatetime?: Date;
}

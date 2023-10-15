export class CreateNewBranchDto {
  owner: string;
  mainShop: string;
  title: string;
  website: string;
  address: string;
  phone?: string;
  description?: string;
  descriptionFull?: string;
  weekStart?: string;
  weekEnd?: string;
  satStart?: string;
  satEnd?: string;
  sunStart?: string;
  sunEnd?: string;
  aroundTheClock?: boolean;
  contract: string;
}

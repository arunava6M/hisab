interface ExpenseType {
  category: {
    icon: string;
    name: string;
  };
  amount: number;
  description: string;
  owner: string;
  date: string;
}

interface UserType {
  id: string;
  email: string;
  firstName: string;
}

interface CategoryType {
  _id: string;
  name: string;
  budget: number;
  icon: string;
  owner: string;
  sharedWith: Array<string>;
}

interface AggregatedCategory {
  description: string;
  total: string;
  categoryId: string;
  budget: string;
  icon: string;
  sharedWith: Array<{ name: string }>;
}

interface ErrorType {
  response: { data: { error: string; details: string } };
}

interface ExpenseProps {
  expense: ExpenseType;
  uniqueKey: number;
  showDateLine: boolean;
}

export type {
  ExpenseType,
  UserType,
  CategoryType,
  ErrorType,
  AggregatedCategory,
  ExpenseProps,
};

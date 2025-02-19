export interface SelectorProps<T> {
  label: string;
  values: T[];
  onSelect: (value: T) => void;
  borderColor: string;
  disabled: boolean;
  currentValue: T;
}

export enum SELECTORS {
  ROWS = "Rows",
  RISK = "Risk",
}

export enum RiskTypes {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

const data: Data = {
  report: [],
};

interface Data {
  report: {
    id: string;
    source: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    type: 'expense' | 'income';
  }[];
}

data.report.push({
  id: 'uuid',
  source: 'Salary',
  amount: 7500,
  created_at: new Date(),
  updated_at: new Date(),
  type: 'expense',
});

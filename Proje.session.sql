INSERT INTO transactions (
    id,
    user_id,
    category_id,
    amount,
    description,
    transaction_date,
    created_at
  )
VALUES (
    id:int,
    user_id:int,
    category_id:int,
    'description:varchar'
    'amount:decimal',
    'transaction_date:date',
    'created_at:timestamp'
  );
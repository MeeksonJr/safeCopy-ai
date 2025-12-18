ALTER TABLE organizations
DROP COLUMN paddle_customer_id,
DROP COLUMN paddle_subscription_id,
DROP COLUMN subscription_status;

ALTER TABLE organizations
ADD COLUMN paypal_customer_id TEXT UNIQUE,
ADD COLUMN paypal_subscription_id TEXT UNIQUE,
ADD COLUMN subscription_status TEXT;

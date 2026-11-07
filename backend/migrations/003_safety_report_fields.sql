-- 003 — Add actions_taken and witnesses to safety_reports.
--
-- The form has always collected these fields but handleSubmit never sent
-- them, and the table had no columns for them. A field engineer fills
-- them in thinking they are recorded.

ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS actions_taken text;
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS witnesses text;

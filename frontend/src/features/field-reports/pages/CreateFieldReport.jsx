import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Input, Select, Textarea, Button } from '@/components/common';
import { useFieldReportActions } from '../hooks/useFieldReports';
import { useUiStore } from '@/store/uiStore';

const REPORT_TYPES = ['Daily', 'Weekly', 'Incident', 'Completion', 'Progress', 'Safety'];

const CreateFieldReport = () => {
  const navigate = useNavigate();
  const { addNotification } = useUiStore();
  const { createReport, isLoading } = useFieldReportActions();

  const [form, setForm] = useState({
    job_title: '', job_location: '', client_name: '',
    report_date: new Date().toISOString().split('T')[0],
    report_type: 'Daily', content: '',
    weather_conditions: '', crew_count: '', equipment_used: '',
    issues_encountered: '', next_day_plan: ''
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (form.job_title.trim().length < 2) e.job_title = 'Job title is required';
    if (form.job_location.trim().length < 2) e.job_location = 'Location is required';
    if (form.client_name.trim().length < 2) e.client_name = 'Client name is required';
    if (form.content.trim().length < 10) e.content = 'Report content must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      job_title: form.job_title, job_location: form.job_location, client_name: form.client_name,
      report_date: form.report_date, report_type: form.report_type, content: form.content,
      weather_conditions: form.weather_conditions || undefined,
      crew_count: form.crew_count ? Number(form.crew_count) : undefined,
      equipment_used: form.equipment_used || undefined,
      issues_encountered: form.issues_encountered || undefined,
      next_day_plan: form.next_day_plan || undefined
    };
    try {
      await createReport(payload);
      addNotification({ type: 'success', message: 'Field report submitted for review.' });
      navigate('/field-reports');
    } catch (err) {
      addNotification({ type: 'error', message: err.message || 'Failed to submit report' });
    }
  };

  return (
    <PageWrapper title="New Field Report">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Report Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Job Title" value={form.job_title} onChange={(e) => set('job_title', e.target.value)} error={errors.job_title} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Client" value={form.client_name} onChange={(e) => set('client_name', e.target.value)} error={errors.client_name} required />
                <Input label="Location" value={form.job_location} onChange={(e) => set('job_location', e.target.value)} error={errors.job_location} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Report Date" type="date" value={form.report_date} onChange={(e) => set('report_date', e.target.value)} />
                <Select label="Report Type" value={form.report_type} onChange={(e) => set('report_type', e.target.value)}>
                  {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <Textarea label="Report Content" value={form.content} onChange={(e) => set('content', e.target.value)} error={errors.content} rows={5} placeholder="Describe the work performed, progress, and observations..." required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Weather (Optional)" value={form.weather_conditions} onChange={(e) => set('weather_conditions', e.target.value)} />
                <Input label="Crew Count (Optional)" type="number" min="0" value={form.crew_count} onChange={(e) => set('crew_count', e.target.value)} />
              </div>
              <Textarea label="Equipment Used (Optional)" value={form.equipment_used} onChange={(e) => set('equipment_used', e.target.value)} rows={2} />
              <Textarea label="Issues Encountered (Optional)" value={form.issues_encountered} onChange={(e) => set('issues_encountered', e.target.value)} rows={2} />
              <Textarea label="Next Day Plan (Optional)" value={form.next_day_plan} onChange={(e) => set('next_day_plan', e.target.value)} rows={2} />
              <Button type="submit" isLoading={isLoading} className="w-full">Submit Report</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default CreateFieldReport;

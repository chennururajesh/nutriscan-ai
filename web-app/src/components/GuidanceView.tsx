import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertTriangle, HeartPulse, FileText, Send, MessageSquare,
  ArrowLeft, HelpCircle, Check, PhoneCall, RefreshCw, AlertCircle,
  Download, Clock, ChevronRight, Sparkles, Layers, Cpu
} from 'lucide-react';
import { ScanStageResult } from '../services/scanEngine';
import {
  getCommodityPrecautions,
  getHealthToxicityImpact,
  answerPrecautionQuestion,
  FoodSafetyRequest,
  PrecautionProfile,
  HealthImpactProfile
} from '../services/guidanceEngine';

interface GuidanceViewProps {
  scanResult: ScanStageResult | null;
  onBackToScanner: () => void;
  onNewScan: () => void;
}

export function GuidanceView({ scanResult, onBackToScanner, onNewScan }: GuidanceViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'precautions' | 'health' | 'request'>('precautions');

  // Commodity context
  const commodity = scanResult?.identifiedFood || 'Apple';
  const damagePct = scanResult?.damagePercentage || 0;
  const adulterants = scanResult?.adulterantsScreened || ['Artificial wax coating'];
  const edibilityStatus = scanResult?.edibilityStatus || 'Safe to Consume';

  // Derived profiles
  const precautions: PrecautionProfile = getCommodityPrecautions(commodity, damagePct, adulterants);
  const healthImpact: HealthImpactProfile = getHealthToxicityImpact(commodity, damagePct, adulterants, edibilityStatus);

  // Interactive "Ask Precautions AI" state
  const [userQuery, setUserQuery] = useState<string>('');
  const [activeAnswer, setActiveAnswer] = useState<{ question: string; answer: string; severity: 'info' | 'warning' | 'danger' } | null>(null);

  // Suggested questions
  const sampleQuestions = [
    `Can I boil or bake this ${commodity} to kill bacteria?`,
    `How do I safely remove artificial wax coating at home?`,
    `Is cutting away bruised portions safe for children or pregnant women?`,
    `Can I blend or juice this ${commodity}?`,
    `How should I store this ${commodity} to prevent mold spreading?`
  ];

  const handleAskQuestion = (q: string) => {
    if (!q.trim()) return;
    const ans = answerPrecautionQuestion(q, commodity, damagePct);
    setActiveAnswer(ans);
    setUserQuery('');
  };

  // Add Request form state
  const [requestType, setRequestType] = useState<'LAB_VERIFICATION' | 'VENDOR_COMPLAINT' | 'TEST_KIT_REQUEST'>('LAB_VERIFICATION');
  const [consumerName, setConsumerName] = useState<string>('');
  const [consumerContact, setConsumerContact] = useState<string>('');
  const [vendorName, setVendorName] = useState<string>('');
  const [purchaseLocation, setPurchaseLocation] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const [submittedList, setSubmittedList] = useState<FoodSafetyRequest[]>([]);
  const [justSubmitted, setJustSubmitted] = useState<FoodSafetyRequest | null>(null);

  // Load existing requests
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutriscan_requests');
      if (saved) {
        setSubmittedList(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load requests', e);
    }
  }, []);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerName || !consumerContact || !vendorName) {
      alert('Please fill in your name, contact information, and vendor details.');
      return;
    }

    const newRequest: FoodSafetyRequest = {
      id: 'REQ-' + Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      requestType,
      consumerName,
      consumerContact,
      vendorName,
      purchaseLocation: purchaseLocation || 'Local Market',
      batchNumber: batchNumber || 'N/A',
      scannedCommodity: commodity,
      damagePercentage: damagePct,
      adulterantsScreened: adulterants,
      adulterationStatus: scanResult?.adulterationStatus || 'Pass',
      additionalNotes: additionalNotes || 'Sample flagged by Dew AI during consumer intake.',
      status: 'SUBMITTED',
      trackingNumber: 'NUTRI-DEW-' + Math.floor(100000 + Math.random() * 900000)
    };

    const updated = [newRequest, ...submittedList];
    setSubmittedList(updated);
    setJustSubmitted(newRequest);
    try {
      localStorage.setItem('nutriscan_requests', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save requests', err);
    }

    // Reset inputs
    setVendorName('');
    setPurchaseLocation('');
    setBatchNumber('');
    setAdditionalNotes('');
  };

  return (
    <div className="guidance-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Navigation & Context Bar */}
      <div className="card" style={{ padding: '18px 24px', background: '#F8FAF8', borderLeft: '5px solid #006D3A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="btn-outline" onClick={onBackToScanner} style={{ padding: '8px 16px', fontSize: '0.85rem' }} id="btn-back-scanner">
              <ArrowLeft size={16} /> Back to Scanner
            </button>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#006D3A', letterSpacing: '0.5px' }}>
                STAGE 7: POST-SCREENING SAFETY &amp; LAB PORTAL
              </span>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Food Precautions, Health Impact &amp; Requests
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Inspecting: <strong>{commodity}</strong>
            </span>
            <span className={`badge ${damagePct > 25 ? 'badge-danger' : damagePct > 6 ? 'badge-warning' : 'badge-success'}`}>
              {damagePct}% Damaged Area
            </span>
          </div>
        </div>

        {/* Scanned Sample Quick Summary Card */}
        {scanResult && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {scanResult.imagePreviewUrl && (
                <img
                  src={scanResult.imagePreviewUrl}
                  alt="Scanned thumbnail"
                  style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }}
                />
              )}
              <div>
                <div><strong>Edibility Status:</strong> {scanResult.edibilityStatus}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Adulteration Screening: {scanResult.adulterationStatus}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-success"><Cpu size={12} /> Offline Dew Mode</span>
              <span className="badge badge-success"><Clock size={12} /> {scanResult.inferenceTimeMs}ms Latency</span>
            </div>
          </div>
        )}
      </div>

      {/* 3-Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '4px', flexWrap: 'wrap' }}>
        <button
          className={`nav-btn ${activeSubTab === 'precautions' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('precautions')}
          style={{ fontSize: '0.95rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          id="tab-precautions"
        >
          <ShieldCheck size={18} /> 1. Food Precautions &amp; Ask AI
        </button>
        <button
          className={`nav-btn ${activeSubTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('health')}
          style={{ fontSize: '0.95rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          id="tab-health"
        >
          <HeartPulse size={18} /> 2. Health Toxicity &amp; Medical Impact
        </button>
        <button
          className={`nav-btn ${activeSubTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('request')}
          style={{ fontSize: '0.95rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          id="tab-request"
        >
          <FileText size={18} /> 3. Submit Lab / Inspection Request ({submittedList.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-PAGE 1: PRECAUTIONS & ASK PRECAUTIONS AI */}
      {/* ========================================================================= */}
      {activeSubTab === 'precautions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Critical Warnings if any */}
          {precautions.criticalWarnings.length > 0 && (
            <div className="card" style={{ borderLeft: '6px solid #DC2626', background: '#FEF2F2', padding: '20px' }}>
              <h3 style={{ color: '#991B1B', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '1.15rem' }}>
                <AlertTriangle size={22} color="#DC2626" /> Critical Safety Directives for {commodity}
              </h3>
              <ul style={{ margin: 0, paddingLeft: '22px', color: '#7F1D1D', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {precautions.criticalWarnings.map((warn, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}><strong>{warn}</strong></li>
                ))}
              </ul>
            </div>
          )}

          {/* 3 Pillars of Food Decontamination */}
          <div className="grid-3">
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>1. Surface Washing Protocol</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {precautions.washingProtocol.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <AlertCircle size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>2. Surgical Trimming Margins</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {precautions.trimmingInstructions}
              </p>
              <div style={{ marginTop: '12px', background: '#FFFBEB', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#92400E' }}>
                💡 <em>Rule of Thumb:</em> Microscopic mold hyphae penetrate 1.5 cm beyond visible surface rot. Always use a clean knife.
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Check size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>3. Safe Storage &amp; Isolation</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {precautions.storageRules.map((rule, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{rule}</li>
                ))}
              </ul>
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Culinary Recommendation:</strong> {precautions.culinaryAdvice}
              </div>
            </div>
          </div>

          {/* INTERACTIVE "ASK PRECAUTIONS AI" HUB */}
          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)', border: '1px solid #BBF7D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={22} color="#16A34A" />
              <h3 style={{ margin: 0, color: '#166534', fontSize: '1.25rem' }}>
                Ask Precautions AI &bull; Food Safety Knowledge Assistant
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#15803D', marginBottom: '16px' }}>
              Have questions regarding how to safely wash, store, cook, or prepare this {commodity}? Click any common inquiry below or type your own question:
            </p>

            {/* Quick Inquiry Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {sampleQuestions.map((sq, i) => (
                <button
                  key={i}
                  className="btn-outline"
                  style={{ fontSize: '0.82rem', padding: '6px 14px', background: '#FFFFFF', borderColor: '#86EFAC', color: '#166534' }}
                  onClick={() => handleAskQuestion(sq)}
                >
                  <HelpCircle size={14} style={{ marginRight: '4px' }} /> {sq}
                </button>
              ))}
            </div>

            {/* User Custom Query Box */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder={`Ask any food safety or precaution question for ${commodity}...`}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(userQuery)}
                style={{ flex: 1, minWidth: '280px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                id="input-precaution-question"
              />
              <button
                className="btn-primary"
                onClick={() => handleAskQuestion(userQuery)}
                style={{ padding: '12px 22px', fontSize: '0.95rem' }}
                id="btn-ask-precaution"
              >
                <MessageSquare size={16} /> Ask Assistant
              </button>
            </div>

            {/* Active Answer Card */}
            {activeAnswer && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '18px',
                  borderRadius: '10px',
                  background: activeAnswer.severity === 'danger' ? '#FEF2F2' : activeAnswer.severity === 'warning' ? '#FFFBEB' : '#F8FAFC',
                  border: `1px solid ${activeAnswer.severity === 'danger' ? '#FECACA' : activeAnswer.severity === 'warning' ? '#FDE68A' : '#E2E8F0'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1E293B' }}>
                    Q: &ldquo;{activeAnswer.question}&rdquo;
                  </span>
                  <span className={`badge ${activeAnswer.severity === 'danger' ? 'badge-danger' : activeAnswer.severity === 'warning' ? 'badge-warning' : 'badge-success'}`}>
                    Verified Dew Guidance
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
                  {activeAnswer.answer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 2: HEALTH IMPACT & TOXICITY ASSESSMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Risk Level Banner */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: `6px solid ${
                healthImpact.overallRiskLevel.includes('Safe') ? '#16A34A' :
                healthImpact.overallRiskLevel.includes('Mild') ? '#3B82F6' :
                healthImpact.overallRiskLevel.includes('Moderate') ? '#D97706' : '#DC2626'
              }`,
              background: healthImpact.overallRiskLevel.includes('Safe') ? '#F0FDF4' :
                          healthImpact.overallRiskLevel.includes('Mild') ? '#EFF6FF' :
                          healthImpact.overallRiskLevel.includes('Moderate') ? '#FFFBEB' : '#FEF2F2'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  CLINICAL TOXICITY &amp; PATHOGEN HAZARD ASSESSMENT
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {healthImpact.overallRiskLevel} ({healthImpact.riskScorePercent}/100 Risk Index)
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Biological Degradation:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: damagePct > 25 ? '#DC2626' : '#16A34A' }}>
                  {damagePct}% Rot &amp; Decay Area
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${healthImpact.riskScorePercent}%`,
                  height: '100%',
                  background: healthImpact.riskScorePercent > 50 ? '#DC2626' : healthImpact.riskScorePercent > 20 ? '#F59E0B' : '#16A34A',
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>

          {/* Demographic Vulnerability Grid */}
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.15rem' }}>Population Vulnerability Assessment</h3>
            <div className="grid-2">
              {healthImpact.demographics.map((demo, idx) => (
                <div key={idx} className="card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{demo.group}</span>
                    <span className={`badge ${demo.riskLevel === 'HIGH' || demo.riskLevel === 'CRITICAL' ? 'badge-danger' : demo.riskLevel === 'MODERATE' ? 'badge-warning' : 'badge-success'}`}>
                      {demo.riskLevel} RISK
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {demo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mycotoxin & Chemical Hazards Breakdown */}
          <div className="grid-2">
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
                <AlertTriangle size={18} /> Mycotoxin &amp; Biological Hazards
              </h3>
              {healthImpact.mycotoxinHazards.length === 0 ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  No significant mycotoxins or necrotic biological rot detected in this sample.
                </p>
              ) : (
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {healthImpact.mycotoxinHazards.map((hazard, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{hazard}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706' }}>
                <AlertCircle size={18} /> Chemical &amp; Adulterant Hazards
              </h3>
              {healthImpact.chemicalHazards.length === 0 ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  No caustic chemicals, non-permitted dyes, or artificial ripening markers flagged.
                </p>
              ) : (
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {healthImpact.chemicalHazards.map((ch, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{ch}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Emergency Helpline & Symptoms to Watch */}
          <div className="card" style={{ padding: '22px', background: '#F8FAF8' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Emergency Health Guidance &amp; Symptoms to Monitor</h3>
            <div className="grid-2" style={{ gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '6px' }}>Symptoms to Watch if Ingested:</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {healthImpact.symptomsToMonitor.map((sym, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{sym}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '6px' }}>Recommended Health Actions:</h4>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {healthImpact.recommendedActions.map((act, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Helplines */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#166534', background: '#DCFCE7', padding: '6px 14px', borderRadius: '8px' }}>
                <PhoneCall size={16} /> <strong>National Poison Info Helpline:</strong> 1800-116-117
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#1E40AF', background: '#DBEAFE', padding: '6px 14px', borderRadius: '8px' }}>
                <PhoneCall size={16} /> <strong>National Consumer Grievance:</strong> 1915 (Toll-Free)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PAGE 3: SUBMIT OFFICIAL LAB / INSPECTION REQUEST */}
      {/* ========================================================================= */}
      {activeSubTab === 'request' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Submission Success Alert */}
          {justSubmitted && (
            <div className="card" style={{ borderLeft: '6px solid #16A34A', background: '#F0FDF4', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#DCFCE7', padding: '10px', borderRadius: '50%', color: '#16A34A' }}>
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#166534', fontSize: '1.15rem' }}>
                      Request Successfully Submitted!
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#15803D' }}>
                      Official Tracking Reference: <strong>{justSubmitted.trackingNumber}</strong>
                    </p>
                  </div>
                </div>
                <button
                  className="btn-outline"
                  onClick={() => alert(`Official Request Record:\nTracking ID: ${justSubmitted.trackingNumber}\nCommodity: ${justSubmitted.scannedCommodity}\nVendor: ${justSubmitted.vendorName}\nStatus: ASSIGNED_TO_DISTRICT_LAB`)}
                  style={{ fontSize: '0.85rem', padding: '8px 16px', background: '#FFFFFF' }}
                >
                  <Download size={15} /> Download PDF Receipt
                </button>
              </div>
            </div>
          )}

          {/* Request Form */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <FileText size={22} color="#006D3A" />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                Submit Official Food Safety &amp; Laboratory Verification Request
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              File an official inspection request to route this scanned sample to the state food laboratory for GC-MS/HPLC verification or report non-compliant vendors.
            </p>

            <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Request Type Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  Select Request Objective:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  <label
                    style={{
                      border: `2px solid ${requestType === 'LAB_VERIFICATION' ? '#006D3A' : 'var(--border-card)'}`,
                      background: requestType === 'LAB_VERIFICATION' ? '#F0FDF4' : '#FFFFFF',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="reqType"
                      checked={requestType === 'LAB_VERIFICATION'}
                      onChange={() => setRequestType('LAB_VERIFICATION')}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Lab Chemical Verification</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      Request GC-MS analysis for synthetic waxes, toxic dyes, or banned ripening agents.
                    </div>
                  </label>

                  <label
                    style={{
                      border: `2px solid ${requestType === 'VENDOR_COMPLAINT' ? '#006D3A' : 'var(--border-card)'}`,
                      background: requestType === 'VENDOR_COMPLAINT' ? '#F0FDF4' : '#FFFFFF',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="reqType"
                      checked={requestType === 'VENDOR_COMPLAINT'}
                      onChange={() => setRequestType('VENDOR_COMPLAINT')}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Report Adulterated Food Vendor</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      File an official grievance against supermarket or market stall selling adulterated stock.
                    </div>
                  </label>

                  <label
                    style={{
                      border: `2px solid ${requestType === 'TEST_KIT_REQUEST' ? '#006D3A' : 'var(--border-card)'}`,
                      background: requestType === 'TEST_KIT_REQUEST' ? '#F0FDF4' : '#FFFFFF',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="reqType"
                      checked={requestType === 'TEST_KIT_REQUEST'}
                      onChange={() => setRequestType('TEST_KIT_REQUEST')}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Request Rapid Testing Kit</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      Dispatch household chemical testing strips (iodine, dye strips, pH paper) to address.
                    </div>
                  </label>
                </div>
              </div>

              {/* 2-Column Fields: Consumer Info */}
              <div className="grid-2" style={{ gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Consumer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Chennuru"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    id="input-consumer-name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Phone / Email Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., +91 98765 43210 or email@domain.com"
                    value={consumerContact}
                    onChange={(e) => setConsumerContact(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    id="input-consumer-contact"
                  />
                </div>
              </div>

              {/* 2-Column Fields: Vendor & Purchase Info */}
              <div className="grid-2" style={{ gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Vendor / Merchant / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., FreshSupermarket Stall 12 or Blinkit Order"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    id="input-vendor-name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Purchase Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hyderabad, Telangana"
                    value={purchaseLocation}
                    onChange={(e) => setPurchaseLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    id="input-purchase-location"
                  />
                </div>
              </div>

              {/* Batch & Additional Notes */}
              <div className="grid-2" style={{ gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Batch / Lot / Invoice Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., LOT-2026-X491"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Additional Observations / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Chemical smell, unusual white powder residue on peel"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Auto-Attached Dew AI Sample Diagnostics Badge */}
              <div style={{ background: '#F8FAF8', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: '#006D3A' }}>📎 Attached Dew AI Diagnostics:</span>{' '}
                Commodity: <strong>{commodity}</strong> &bull; Damage: <strong>{damagePct}%</strong> &bull; Status: <strong>{scanResult?.edibilityStatus || 'N/A'}</strong> &bull; Screened: <strong>{adulterants.join(', ')}</strong>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                id="btn-submit-request"
              >
                <Send size={18} /> SUBMIT OFFICIAL REQUEST
              </button>
            </form>
          </div>

          {/* Submitted Requests History Table */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> My Submitted Requests ({submittedList.length})
            </h3>
            {submittedList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No lab verification or complaint requests submitted yet. Use the form above to file a request.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '8px 10px' }}>Tracking ID</th>
                      <th style={{ padding: '8px 10px' }}>Objective</th>
                      <th style={{ padding: '8px 10px' }}>Commodity</th>
                      <th style={{ padding: '8px 10px' }}>Vendor / Location</th>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedList.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px', fontWeight: 700, color: '#006D3A' }}>{req.trackingNumber}</td>
                        <td style={{ padding: '10px' }}>
                          {req.requestType === 'LAB_VERIFICATION' ? '🧪 Lab Verification' : req.requestType === 'VENDOR_COMPLAINT' ? '🚨 Vendor Complaint' : '📦 Test Kit'}
                        </td>
                        <td style={{ padding: '10px' }}>{req.scannedCommodity} ({req.damagePercentage}%)</td>
                        <td style={{ padding: '10px' }}>{req.vendorName} ({req.purchaseLocation})</td>
                        <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{req.timestamp}</td>
                        <td style={{ padding: '10px' }}>
                          <span className="badge badge-success">Assigned to District Lab</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

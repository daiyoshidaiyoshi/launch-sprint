import { Zap, RefreshCw, TrendingUp, ChevronDown, Monitor, Layers, Building2, Megaphone, X, Check } from 'lucide-react';
import { useState, useRef } from 'react';

type FormFields = {
  company: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.company.trim()) errors.company = '会社名を入力してください';
  if (!fields.email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!/^[a-zA-Z0-9_%+\-]+(\.[a-zA-Z0-9_%+\-]+)*@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(fields.email)) {
    errors.email = 'メールアドレスの形式が正しくありません';
  }
  if (!fields.message.trim()) errors.message = 'ご相談内容を入力してください';
  return errors;
}

export default function App() {
  const [fields, setFields] = useState<FormFields>({ company: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);

  function handleScrollToContact() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      companyInputRef.current?.focus({ preventScroll: true });
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 900);
    }, 600);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setFormError(null);
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setFormError(data.message ?? '送信に失敗しました');
        }
        return;
      }
      setIsSubmitted(true);
    } catch {
      setFormError('ネットワークエラーが発生しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes form-highlight {
          0%   { border-color: #e5e7eb; background-color: #ffffff; }
          40%  { border-color: #93c5fd; background-color: #eff6ff; }
          100% { border-color: #e5e7eb; background-color: #ffffff; }
        }
        .form-highlight {
          animation: form-highlight 0.8s ease-out forwards;
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Abstract flowing curve graphics - from lower-left to upper-right */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <svg 
            className="absolute w-full h-full" 
            viewBox="0 0 1200 700" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Large flowing curves - clearly visible */}
            
            {/* Background curve - very light blue-gray */}
            <path
              d="M -50 600 Q 200 450, 400 380 T 800 250 Q 1000 200, 1250 150"
              stroke="#E0E7FF"
              strokeWidth="180"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />
            
            {/* Middle curve - light blue */}
            <path
              d="M -100 550 Q 250 380, 500 320 T 900 180 Q 1100 130, 1300 80"
              stroke="#BFDBFE"
              strokeWidth="150"
              fill="none"
              opacity="0.35"
              strokeLinecap="round"
            />
            
            {/* Accent curve - stronger blue */}
            <path
              d="M 0 650 Q 300 480, 550 400 T 950 260 Q 1150 200, 1350 140"
              stroke="#93C5FD"
              strokeWidth="120"
              fill="none"
              opacity="0.3"
              strokeLinecap="round"
            />
            
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          {/* Split layout: Left content + Right consultation panel */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Main brand and value message */}
            <div className="space-y-8">
              {/* Unified Hero Headline */}
              <div className="space-y-3">
                {/* Service name */}
                <div 
                  className="font-bold text-blue-600 tracking-tight leading-none text-[48px]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Launch Sprint
                </div>
                
                {/* Value proposition - connected to service name */}
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight tracking-tight">公開を早め、改善を前に進める。</h1>
              </div>
              
              {/* Body copy */}
              <p className="text-lg text-gray-600 leading-relaxed font-medium">構造設計からUI生成までを圧縮し、公開を早める。<br />機会損失を防ぎながら、検証と改善を前に進めるWeb制作支援です。</p>
            </div>

            {/* Right side - Consultation panel */}
            <div
              id="contact"
              ref={formRef}
              className={`bg-white rounded-2xl border shadow-sm p-8 lg:p-10 ${isHighlighted ? 'form-highlight' : 'border-gray-200'}`}
            >
              {isSubmitted ? (
                /* サンクスメッセージ */
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">送信が完了しました</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    お問い合わせいただきありがとうございます。<br />
                    内容を確認のうえ、担当者よりご連絡いたします。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Panel title */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">初期公開と改善の進め方を相談する</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      構造設計から初期公開、その後の検証・改善まで。AIを活用した一気通貫のWeb制作支援についてご相談いただけます。
                    </p>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    {/* Company name */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        会社名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        ref={companyInputRef}
                        value={fields.company}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.company ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        placeholder="株式会社〇〇"
                      />
                      {errors.company && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.company}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={fields.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        placeholder="taro@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Consultation content */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        ご相談内容 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={fields.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        placeholder="例：新規サービスのLPを制作したい、現行LPのCVRを改善したい など"
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Form-level error */}
                  {formError && (
                    <p className="text-sm text-red-500 text-center">{formError}</p>
                  )}

                  {/* CTA button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {isSubmitting ? '送信中...' : '初期LPの改善ポイントを無料診断'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Scroll Down indicator - aligned with left content */}
        <div className="absolute bottom-8 left-6 lg:left-8">
          
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section heading and intro */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">初期公開を止めない制作へ</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">制作期間の長期化や、完成を待つあいだに検証が止まる課題に対し、Launch Sprintは初期公開と改善を前に進める制作支援です。</p>
          </div>

          {/* Two-column comparison */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left column - Problems */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 lg:p-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-gray-600" />
                </div>
                よくある制作課題
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">
                    設計・デザイン・開発を順に進めるため、初期公開まで時間がかかる
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">
                    完成度を優先するほど、検証開始が遅れやすい
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">
                    公開後の改善まで見据えた進行になりにくい
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Solutions */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 lg:p-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                Launch Sprintの進め方
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-900 leading-relaxed font-medium">AI活用で構造設計とUI生成を圧縮</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-900 leading-relaxed font-medium">
                    まず初期公開を行い、反応をもとに改善
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-900 leading-relaxed font-medium">検証と反復を前提に制作を進行</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section heading */}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 text-center">
            Launch Sprintの3つの特徴
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                高速公開
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AIを活用し、構造設計とUI生成を高速化。初期制作を短いリードタイムで公開まで進めます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                素早い改善
              </h3>
              <p className="text-gray-600 leading-relaxed">
                公開後の反応やフィードバックをもとに、修正・改善案を短いサイクルで反映しやすくします。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                検証を前提にした進行
              </h3>
              <p className="text-gray-600 leading-relaxed">
                完璧さより、まず公開して反応を見ることを重視。検証と改善を前に進める制作フローです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Comparison Section */}
      <section className="py-18">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section heading and intro */}
          <div className="mb-9 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              従来の制作フローとの違い
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              設計から公開までを一直線に進める従来型に対し、Launch Sprintは初期公開を早め、検証と改善を前提に進めます。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Traditional Process */}
            <div className="space-y-5">
              <div className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                従来のプロセス
              </div>
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">設計</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-gray-300"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">デザイン</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-gray-300"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">開発</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-gray-300"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">テスト</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-gray-300"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">公開</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-gray-700 text-[15px]">数週間〜数ヶ月</p>
                </div>
              </div>
            </div>

            {/* Launch Sprint Process */}
            <div className="space-y-5">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                Launch Sprint
              </div>
              
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-900 font-medium">構造設計 + UI生成</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-blue-400"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-900 font-medium">公開</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-blue-400"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-900 font-medium">検証・改善</span>
                  </div>
                  <div className="ml-5 h-4 border-l-2 border-blue-400"></div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-900 font-medium">再反復</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t-2 border-blue-300">
                  <p className="text-base text-blue-700 font-bold">最短数日で公開！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Deliverables Section */}
      <section className="py-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              対応可能な制作物
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    ランディングページ<br />（LP）
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    初期検証や広告導線に適した構成
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    サービスサイト
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    提供価値を整理して伝える情報設計
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    小規模<br />コーポレートサイト
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    必要情報を絞って整える企業サイト
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    キャンペーンサイト
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    短期訴求に対応した特設ページ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mx-[0px] mt-[0px] mb-[6px] text-center">まずは公開初速を上げるところから。</h2>
          
          <p className="text-lg text-gray-600 leading-relaxed p-[0px] mx-[0px] mt-[-12px] mb-[29px]"><br />新規立ち上げ、検証用LP、改善前提のWebページ制作など、まずはお気軽ご相談ください。</p>
          
          <button
            onClick={handleScrollToContact}
            className="bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 text-lg px-[40px] py-[16px] mx-[0px] my-[4px]"
          >
            初期LPの改善案を無料で受け取る
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2026 Launch Sprint. AI活用型Web制作支援サービス
          </div>
        </div>
      </footer>
    </div>
  );
}
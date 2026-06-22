import React, { useState } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronUp, ChevronRight,
  Search, RotateCw, Home, ListChecks, MessageCircle, MessagesSquare,
  Check, HelpCircle, Settings, Gift, GraduationCap, Image as ImageIcon,
  FileText, UserPlus, Mail, Coins, X
} from 'lucide-react';

// ===== Brand tokens (extracted from Libecity screenshots) =====
const NAVY = '#2D4258';
const TEAL = '#3B9E84';
const TEAL_DARK = '#2E8C7C';
const TEAL_STRIPE = '#3B7A6A';
const TEAL_BG = '#E8F5F1';
const TEAL_PALE = '#D4EBE3';
const ORANGE_DOT = '#F4A53E';
const GOLD = '#E89320';
const SOFT_GOLD_BG = '#FDF1DC';
const SOFT_BLUE_BG = '#EAF3FB';
const CHECK_BLUE = '#3D8FE4';
const INK = '#23323D';
const INK_SOFT = '#5A6A73';
const MUTED = '#8E9AA1';
const HAIRLINE = '#E5E9EB';
const SHEET_BG = '#F4F6F7';

// ===== Reusable: Progress ring =====
function ProgressRing({ size, stroke, done, total, ringBg = '#EDEEF0', color = TEAL, children }) {
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(done / total, 1) : 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="white" stroke={ringBg} strokeWidth={stroke} />
        <circle
          cx={c} cy={c} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="butt"
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ===== Status bar (top of phone) =====
function StatusBar() {
  return (
    <div className="h-10 flex items-center justify-between px-6 text-white text-[13px] font-semibold" style={{ background: NAVY }}>
      <span>9:35</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">●●●●</span>
        <span className="text-[10px]">📶</span>
        <span className="text-[10px]">🔋</span>
      </div>
    </div>
  );
}

// ===== App header bar =====
function AppHeader({ title, onBack, showReload = false }) {
  return (
    <div className="h-12 flex items-center px-3" style={{ background: NAVY, borderBottom: `1px solid ${NAVY}` }}>
      {onBack ? (
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-white active:opacity-60">
          <ChevronLeft size={22} />
        </button>
      ) : <div className="w-8" />}
      <div className="flex-1 text-center text-white font-bold text-[15px]">{title}</div>
      {showReload ? (
        <button className="w-8 h-8 flex items-center justify-center text-white active:opacity-60">
          <RotateCw size={18} />
        </button>
      ) : <div className="w-8" />}
    </div>
  );
}

// ===== Footer tabs =====
function FooterTabs({ active = 'list' }) {
  const tabs = [
    { id: 'home',  label: 'ホーム',     Icon: Home },
    { id: 'list',  label: '宿題リスト',  Icon: ListChecks },
    { id: 'chat',  label: '参加チャット', Icon: MessageCircle },
    { id: 'mumble',label: 'つぶやき',    Icon: MessagesSquare },
    { id: 'ai',    label: 'AIに質問',    Icon: null, custom: '🦁' },
  ];
  return (
    <div className="grid grid-cols-5 bg-white pt-2 pb-1.5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <div key={t.id} className="flex flex-col items-center gap-0.5">
            <div style={{ color: isActive ? TEAL : MUTED }} className="text-[22px] leading-none">
              {t.custom ? (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-base ${isActive ? '' : 'opacity-70'}`} style={{ background: isActive ? TEAL_BG : '#F0F1F3' }}>
                  {t.custom}
                </div>
              ) : (
                <t.Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
              )}
            </div>
            <div className="text-[10px] font-semibold" style={{ color: isActive ? TEAL : MUTED }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ===== Effect bar (年間 ◯円 相当) =====
function EffectBar({ amount = '90,000円' }) {
  return (
    <div className="px-3 py-2 flex items-center gap-2 border-t" style={{ borderColor: HAIRLINE, background: 'white' }}>
      <div className="text-2xl">💰</div>
      <div className="flex-1 leading-tight">
        <div className="text-[11px]" style={{ color: INK_SOFT }}>あなたが完了した宿題で見込める効果</div>
        <div className="text-[13px] font-semibold" style={{ color: INK }}>
          年間 <span className="text-[16px] font-bold" style={{ color: GOLD }}>{amount}</span> 相当
        </div>
      </div>
      <ChevronDown size={18} color={CHECK_BLUE} />
    </div>
  );
}

// ===== Tag pill =====
function TagPill({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border" style={{ color: TEAL_DARK, borderColor: TEAL_DARK, background: 'white' }}>
      {label}
    </span>
  );
}

// ===== Homework item (collapsed + expandable) =====
function HomeworkItem({ tag, title, expanded, onToggle, expandedContent, peers, onPeersClick, peerHint }) {
  return (
    <div className="overflow-hidden" style={{ background: TEAL_BG }}>
      <button onClick={onToggle} className="w-full flex items-stretch text-left">
        <div className="w-2.5 flex items-center justify-center text-white text-[10px] font-bold leading-tight py-2 self-stretch" style={{ background: TEAL_STRIPE, writingMode: 'vertical-rl' }}>
          必修
        </div>
        <div className="px-2 py-2.5 flex items-start gap-2 flex-1">
          <div className="w-7 h-7 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0" style={{ borderColor: CHECK_BLUE, background: 'white' }}>
            {/* checkbox - blank for unchecked */}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <TagPill label={tag} />
            </div>
            <div className="text-[13px] font-bold leading-snug" style={{ color: INK }}>{title}</div>
          </div>
          <div className="mt-2" style={{ color: TEAL }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Peers row — always visible, independently tappable */}
      {peers && (
        <div className="pl-[18px] pr-2 pb-2 -mt-1 flex items-center gap-2">
          <button
            onClick={onPeersClick}
            className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.65)' }}
          >
            <div className="flex -space-x-1.5">
              {peers.avatars.map((a, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] border-2 border-white"
                  style={{ background: a.bg }}
                >
                  {a.emoji}
                </div>
              ))}
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white" style={{ background: TEAL, color: 'white' }}>
                +{peers.more}
              </div>
            </div>
            <span className="text-[10.5px] font-semibold" style={{ color: TEAL_DARK }}>
              今日 {peers.count}人が取り組み中
            </span>
            <ChevronRight size={12} color={TEAL} />
          </button>
          {peerHint && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white animate-pulse" style={{ background: GOLD }}>
              👆 仲間のプロフへ
            </span>
          )}
        </div>
      )}

      {expanded && expandedContent && (
        <div className="bg-white px-3 pt-3 pb-3 border-t" style={{ borderColor: TEAL_PALE }}>
          {expandedContent}
        </div>
      )}
    </div>
  );
}

// ===== Force card (1 of 5) =====
function ForceCard({ name, done, total, selected, hasNotif, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center pt-1.5 pb-2 rounded-xl active:scale-95 transition-transform"
      style={{
        background: 'white',
        border: selected ? `2px solid ${TEAL}` : `1px solid ${HAIRLINE}`,
        width: 64,
        height: 84,
      }}
    >
      {hasNotif && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: ORANGE_DOT }} />
      )}
      <ProgressRing size={46} stroke={3.5} done={done} total={total} color={selected ? TEAL : '#D7DBDD'}>
        <div className="text-center leading-none">
          <div className="text-[11px] font-bold" style={{ color: selected ? INK : MUTED }}>
            <span className="text-[13px]">{done}</span>
            <span className="text-[9px]" style={{ color: MUTED }}>/{total}</span>
          </div>
        </div>
      </ProgressRing>
      <div className="text-[11px] font-bold mt-1" style={{ color: selected ? INK : MUTED }}>{name}</div>
      {selected && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0" style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `7px solid ${TEAL}`,
        }} />
      )}
    </button>
  );
}

// ===== Subcategory card (Step 2) =====
function SubcategoryCard({ label, done, total, highlight, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl px-3 py-2.5 text-left active:scale-[0.98] transition-transform relative"
      style={{
        background: highlight ? TEAL_BG : 'white',
        border: highlight ? `1.5px solid ${TEAL}` : `1px solid ${HAIRLINE}`,
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-bold" style={{ color: highlight ? TEAL_DARK : INK }}>{label}</span>
        <span className="text-[11px] font-semibold" style={{ color: MUTED }}>
          <span style={{ color: done > 0 ? TEAL_DARK : MUTED }}>{done}</span>/{total}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 7, height: 7,
              background: i < done ? TEAL : '#DDE2E4',
            }}
          />
        ))}
      </div>
    </button>
  );
}

// =====================================================================
// SCREEN 1: 宿題リスト TOP（5つの力メニュー）
// =====================================================================
function HomeworkListScreen({ onSelectPower, showHint, dismissHint }) {
  const forces = [
    { id: 'save',    name: '貯める力', done: 12, total: 123 },
    { id: 'earn',    name: '稼ぐ力',   done: 3,  total: 28  },
    { id: 'grow',    name: '増やす力', done: 0,  total: 22  },
    { id: 'protect', name: '守る力',   done: 2,  total: 18  },
    { id: 'use',     name: '使う力',   done: 0,  total: 15  },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      {/* Top padding */}
      <div className="h-4" />

      {/* 5 force buttons - vertical, full-width, button-like */}
      <div className="px-3 space-y-2">
        {forces.map((f) => {
          const isSelected = f.id === 'save';
          return (
            <button
              key={f.id}
              onClick={() => onSelectPower(f.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-transform active:scale-[0.99]"
              style={{
                background: 'white',
                border: isSelected ? `2px solid ${TEAL}` : `1px solid ${HAIRLINE}`,
              }}
            >
              <div className="text-left">
                <div className="text-[15px] font-bold leading-tight" style={{ color: isSelected ? TEAL_DARK : INK }}>
                  {f.name}
                </div>
                <div className="text-[11px] mt-1" style={{ color: MUTED }}>
                  {f.done} / {f.total} 件クリア
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isSelected && showHint && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-sm animate-pulse"
                    style={{ background: GOLD }}
                  >
                    👆 TAP
                  </span>
                )}
                <ChevronRight size={18} color={isSelected ? TEAL : MUTED} strokeWidth={2.2} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Flexible spacer to push escape link toward the bottom */}
      <div className="flex-1 min-h-[24px]" />

      {/* Escape valve link: full homework list */}
      <div className="px-3 pb-3 pt-2 text-center">
        <button
          className="text-[12px] font-semibold inline-flex items-center gap-1 hover:underline"
          style={{ color: CHECK_BLUE }}
          onClick={dismissHint}
        >
          <ListChecks size={13} />
          すべての宿題を一覧で表示
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// SCREEN 2: サブカテゴリ進捗マップ（NEW SCREEN）
// =====================================================================
function ProgressMapScreen({ onBack, onSelectSubcategory, showHint, dismissHint }) {
  const subcats = [
    { id: 'phone', label: '通信費',   done: 0, total: 3 },
    { id: 'util',  label: '光熱費',   done: 0, total: 2 },
    { id: 'ins',   label: '保険',     done: 2, total: 4 },
    { id: 'subs',  label: 'サブスク', done: 1, total: 2 },
    { id: 'home',  label: '住居',     done: 0, total: 5 },
    { id: 'car',   label: '車',       done: 1, total: 3 },
    { id: 'food',  label: '食費',     done: 1, total: 4 },
    { id: 'tax',   label: '税金',     done: 0, total: 3 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* "NEW" badge to signal this is the new screen */}
      <div className="mx-3 mt-3 mb-2 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: SOFT_GOLD_BG, border: `1px dashed ${GOLD}` }}>
        <div className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: GOLD }}>NEW</div>
        <div className="text-[11px] leading-tight" style={{ color: INK }}>
          <span className="font-bold">サブカテゴリ進捗マップ</span>
          <span className="ml-1" style={{ color: INK_SOFT }}>— 追加される1画面</span>
        </div>
      </div>

      {/* Force header with big progress ring */}
      <div className="flex items-center gap-4 px-4 pt-2 pb-4">
        <ProgressRing size={92} stroke={9} done={5} total={123} color={TEAL}>
          <div className="text-center leading-none">
            <div className="text-[18px] font-bold" style={{ color: INK }}>
              5<span className="text-[10px] font-semibold" style={{ color: MUTED }}>/123</span>
            </div>
            <div className="text-[10px] font-bold mt-1" style={{ color: INK }}>貯める力</div>
          </div>
        </ProgressRing>
        <div className="flex-1">
          <div className="text-[11px] font-semibold mb-1" style={{ color: TEAL_DARK }}>OVERVIEW</div>
          <div className="text-[13px] leading-snug" style={{ color: INK }}>
            123件の宿題を<br />
            <span className="font-bold">8つのサブカテゴリ</span>で整理。<br />
            気になるところから始めよう。
          </div>
        </div>
      </div>

      <div className="h-px mx-3" style={{ background: HAIRLINE }} />

      {/* Subcategory section header */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="text-[12px] font-bold" style={{ color: INK }}>サブカテゴリで絞り込む</div>
        <div className="text-[11px]" style={{ color: MUTED }}>タップで該当宿題のみ表示</div>
      </div>

      {/* Subcategory grid */}
      <div className="mx-3 grid grid-cols-2 gap-2 pb-3 relative">
        {subcats.map((s, i) => (
          <div key={s.id} className="relative">
            <SubcategoryCard
              label={s.label}
              done={s.done}
              total={s.total}
              highlight={s.id === 'phone'}
              onClick={() => onSelectSubcategory(s.id)}
            />
            {s.id === 'phone' && showHint && (
              <div
                className="absolute z-10 cursor-pointer"
                style={{ bottom: -28, left: '50%', transform: 'translateX(-50%)' }}
                onClick={dismissHint}
              >
                <div className="px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold whitespace-nowrap shadow-lg"
                  style={{ background: GOLD }}
                >
                  👆 ここをタップ
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-3 pb-3 text-[11px] leading-snug" style={{ color: MUTED }}>
        💡 「通信費 0/3」のように小さなチャンクに分解されるので、心理的なハードルが下がります。
      </div>
    </div>
  );
}

// =====================================================================
// SCREEN 3: 絞り込まれた宿題リスト
// =====================================================================
function FilteredListScreen({ onBack, onOpenProfile }) {
  const [expandedId, setExpandedId] = useState('iphone');

  const items = [
    {
      id: 'iphone',
      tag: 'スマホ',
      title: 'スマホはiPhoneにするのがおすすめな理由を知ろう',
      effect: '1,000円/月',
      body: 'トラブルも少ないし、困った時はAppleの神サポートも受けられる。Mac+iPhoneの組み合わせが、一番小金持ち山に登りやすいと思うで',
      learnings: [
        { label: '小金持ち山への成功確率を上げたいなら、スマホはiPhoneにしよう', sub: 'テキストで読む（🦁学長マガジン）', subColor: CHECK_BLUE },
      ],
      peers: {
        count: 12, more: 9,
        avatars: [
          { emoji: '🐱', bg: '#1A1A1A' },
          { emoji: '🐶', bg: '#E8D5B5' },
          { emoji: '🦊', bg: '#F4C7A1' },
        ],
      },
    },
    {
      id: 'sim',
      tag: 'スマホ',
      title: '格安SIMに乗り換えよう',
      peers: {
        count: 8, more: 5,
        avatars: [
          { emoji: '🐻', bg: '#D8C0A0' },
          { emoji: '🐰', bg: '#F0E0E0' },
          { emoji: '🐼', bg: '#EAEAEA' },
        ],
      },
    },
    {
      id: 'wifi',
      tag: 'スマホ',
      title: '自宅Wi-Fiを見直そう',
      peers: {
        count: 5, more: 2,
        avatars: [
          { emoji: '🐯', bg: '#F4D58D' },
          { emoji: '🐧', bg: '#CFE0EA' },
          { emoji: '🐸', bg: '#CFE6C0' },
        ],
      },
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Filter row */}
      <div className="m-3 px-3 py-2 rounded-lg flex items-center justify-between" style={{ background: SHEET_BG }}>
        <div className="flex items-center gap-2 text-[12px]" style={{ color: INK }}>
          <div className="w-4 h-4 rounded border" style={{ borderColor: MUTED }} />
          <span>未完了のみ表示</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-semibold" style={{ color: INK }}>
            残り <span className="text-[14px] font-bold" style={{ color: TEAL_DARK }}>3</span> 件
          </span>
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ border: `1px solid ${HAIRLINE}`, background: 'white' }}>
            <Search size={14} color={INK_SOFT} />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 pb-3">
        {items.map(it => (
          <HomeworkItem
            key={it.id}
            tag={it.tag}
            title={it.title}
            peers={it.peers}
            onPeersClick={onOpenProfile}
            peerHint={it.id === 'iphone'}
            expanded={expandedId === it.id}
            onToggle={() => setExpandedId(expandedId === it.id ? null : it.id)}
            expandedContent={
              it.body && (
                <div className="space-y-3">
                  <div className="flex gap-1.5 text-[12px] leading-snug" style={{ color: INK }}>
                    <span>🦁</span>
                    <p>{it.body}</p>
                  </div>

                  <div>
                    <div className="px-3 py-1.5 text-[12px] font-bold rounded" style={{ background: SHEET_BG, color: INK }}>
                      学習コンテンツ
                    </div>
                    {it.learnings?.map((l, i) => (
                      <div key={i} className="pt-2 px-1">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded border-2 mt-0.5" style={{ borderColor: CHECK_BLUE }} />
                          <div className="flex-1">
                            <div className="text-[12px] font-bold" style={{ color: INK }}>{l.label}</div>
                            <div className="flex items-center gap-1 mt-1 text-[12px]" style={{ color: l.subColor }}>
                              <FileText size={12} />
                              <span className="font-semibold">{l.sub}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: SOFT_GOLD_BG, border: `1px solid #F5D69E` }}>
                    <div className="text-xl">💰</div>
                    <div className="leading-tight text-[12px]" style={{ color: INK }}>
                      この宿題を完了すると<br />
                      <span className="font-bold text-[14px]" style={{ color: GOLD }}>{it.effect}</span>
                      <span>相当の効果が期待できます</span>
                    </div>
                  </div>
                </div>
              )
            }
          />
        ))}
      </div>

      <div className="px-3 pb-3 text-[11px] leading-snug text-center" style={{ color: MUTED }}>
        ✓ 既存のアコーディオン構造はそのまま保たれます
      </div>
    </div>
  );
}

// =====================================================================
// SCREEN 4: メンバープロフィール（ギルド × バッジ 合流）
// =====================================================================
function MemberProfileScreen() {
  const guilds = [
    { icon: "🏕", label: "キャンプ部" },
    { icon: "🌏", label: "タイ移住部" },
    { icon: "🤖", label: "AI活用部" },
  ];
  const badges = [
    { label: "貯める力マスター", state: "master" },
    { label: "増やす力", state: "progress" },
    { label: "守る力", state: "progress" },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: SHEET_BG }}>
      {/* Profile card */}
      <div className="m-3 rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {/* Header band */}
        <div className="px-4 pt-4 pb-3 flex items-start gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0" style={{ background: '#1A1A1A' }}>
            🐱
          </div>
          <div className="flex-1 pt-1">
            <div className="text-[18px] font-bold leading-tight" style={{ color: CHECK_BLUE }}>ニャン太</div>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: SOFT_GOLD_BG, color: GOLD }}>
              🌱 新入生会員
            </div>
            <span className="text-[10px] ml-1.5" style={{ color: MUTED }}>在籍 0ヶ月</span>
          </div>
          <X size={18} color={MUTED} />
        </div>

        <div className="h-px mx-4" style={{ background: HAIRLINE }} />

        {/* 所属している部 */}
        <div className="px-4 pt-3 pb-1">
          <div className="text-[11px] font-bold mb-2" style={{ color: TEAL_DARK }}>所属している部</div>
          <div className="flex flex-wrap gap-1.5">
            {guilds.map((g) => (
              <span key={g.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold" style={{ background: TEAL_BG, color: INK }}>
                <span>{g.icon}</span>{g.label}
              </span>
            ))}
          </div>
        </div>

        {/* 達成バッジ */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-bold" style={{ color: TEAL_DARK }}>5つの力の達成状況</div>
          </div>
          <div className="space-y-1.5">
            {badges.map((b) => {
              const isMaster = b.state === "master";
              return (
                <div key={b.label} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
                    style={{ background: isMaster ? SOFT_GOLD_BG : '#EEF1F2' }}
                  >
                    {isMaster ? "🏅" : "○"}
                  </div>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: isMaster ? INK : MUTED }}
                  >
                    {b.label}
                  </span>
                  {!isMaster && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: '#EEF1F2', color: MUTED }}
                    >
                      取得中
                    </span>
                  )}
                </div>
              );
            })}
            <div className="text-[11px] pt-0.5" style={{ color: CHECK_BLUE }}>すべての称号を見る ›</div>
          </div>
        </div>

        <div className="h-px mx-4" style={{ background: HAIRLINE }} />

        {/* Action buttons */}
        <div className="px-4 py-3 grid grid-cols-3 gap-2">
          {[
            { icon: <UserPlus size={14} />, label: 'フォロー' },
            { icon: <Mail size={14} />, label: 'DMを送る' },
            { icon: <Coins size={14} />, label: 'ポイント' },
          ].map((b) => (
            <button key={b.label} className="flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-bold" style={{ border: `1px solid ${CHECK_BLUE}`, color: CHECK_BLUE }}>
              {b.icon}{b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insight caption */}
      <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl" style={{ background: 'white', border: `1px dashed ${TEAL}` }}>
        <div className="text-[11px] leading-relaxed" style={{ color: INK_SOFT }}>
          <span className="font-bold" style={{ color: TEAL_DARK }}>一目で伝わる：</span>
          「タイ移住に興味があって、AIもやっていて、宿題も結構進んでいる人だ」。
          プロフィールが、共通点を見つけて声をかけるきっかけになる。
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// ROOT
// =====================================================================
export default function LibecityPrototype() {
  const [screen, setScreen] = useState('home'); // home | map | filtered
  const [hintHome, setHintHome] = useState(true);
  const [hintMap, setHintMap] = useState(false);

  const goToMap = () => {
    setScreen('map');
    setHintHome(false);
    setHintMap(true);
  };
  const goToFiltered = () => {
    setScreen('filtered');
    setHintMap(false);
  };
  const goHome = () => setScreen('home');
  const goBackToMap = () => setScreen('map');

  let header, content;

  if (screen === 'home') {
    header = <AppHeader title="経済的自由をつくる宿題リスト" showReload />;
    content = (
      <HomeworkListScreen
        onSelectPower={(id) => { if (id === 'save') goToMap(); }}
        showHint={hintHome}
        dismissHint={() => setHintHome(false)}
      />
    );
  } else if (screen === 'map') {
    header = <AppHeader title="貯める力" onBack={goHome} />;
    content = (
      <ProgressMapScreen
        onBack={goHome}
        onSelectSubcategory={(id) => { if (id === 'phone') goToFiltered(); }}
        showHint={hintMap}
        dismissHint={() => setHintMap(false)}
      />
    );
  } else if (screen === 'filtered') {
    header = <AppHeader title="通信費（3件）" onBack={goBackToMap} />;
    content = <FilteredListScreen onBack={goBackToMap} onOpenProfile={() => setScreen('profile')} />;
  } else {
    header = <AppHeader title="メンバープロフィール" onBack={() => setScreen('filtered')} />;
    content = <MemberProfileScreen />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-6" style={{ background: '#F0F2F4' }}>
      {/* Step indicator */}
      <div className="mb-4 flex items-center gap-2">
        {[
          { key: 'home', label: 'Step 1 — 5つの力' },
          { key: 'map', label: 'Step 2 — 進捗マップ ✨NEW' },
          { key: 'filtered', label: 'Step 3 — 絞り込みリスト' },
          { key: 'profile', label: '＋ メンバープロフ ✨NEW' },
        ].map((s, i, arr) => (
          <React.Fragment key={s.key}>
            <button
              onClick={() => {
                if (s.key === 'home') { setScreen('home'); setHintHome(true); }
                if (s.key === 'map') { setScreen('map'); setHintHome(false); setHintMap(true); }
                if (s.key === 'filtered') { setScreen('filtered'); setHintHome(false); setHintMap(false); }
                if (s.key === 'profile') { setScreen('profile'); setHintHome(false); setHintMap(false); }
              }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors"
              style={{
                background: screen === s.key ? TEAL : 'white',
                color: screen === s.key ? 'white' : INK_SOFT,
                border: screen === s.key ? 'none' : `1px solid ${HAIRLINE}`,
              }}
            >
              {s.label}
            </button>
            {i < arr.length - 1 && <ChevronRight size={14} color={MUTED} />}
          </React.Fragment>
        ))}
      </div>

      {/* Phone bezel */}
      <div
        className="rounded-[44px] shadow-2xl p-2"
        style={{ background: '#111', width: 392 }}
      >
        <div className="rounded-[36px] overflow-hidden bg-white relative" style={{ height: 760, display: 'flex', flexDirection: 'column' }}>
          {/* Notch */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full z-30" style={{ background: '#111' }} />

          <StatusBar />
          {header}
          {content}

          {/* Effect bar — only on homework-related screens */}
          {screen !== 'profile' && <EffectBar amount="90,000円" />}
          <FooterTabs active={screen === 'profile' ? 'chat' : 'list'} />
        </div>
      </div>

      <div className="mt-4 max-w-md text-center text-[12px] leading-snug" style={{ color: INK_SOFT }}>
        <span className="font-semibold">触れるプロトタイプ：</span>
        Step 3 の宿題に表示される <span className="font-bold" style={{ color: TEAL_DARK }}>「◯人が取り組み中」</span> をタップすると、
        その仲間のプロフィール（所属する部 × 達成バッジ）が開きます。同じ宿題が、人とつながるきっかけになります。
      </div>
    </div>
  );
}

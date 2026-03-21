import { closeModal, formatDateTime, initModals, openModal } from '@/lib/ui';

type LogLevel = 'info' | 'warning' | 'error' | 'success';
type LogCategory = 'auth' | 'api' | 'system';

interface Log {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  isTest?: boolean;
}

const STORAGE_KEY = 'app_logs';
const MAX_LOGS = 500;
let logs: Log[] = [];

function generateMockLogs(): Log[] {
  const msgs: Record<LogCategory, string[]> = {
    auth: ['Login realizado', 'Falha na autenticação', 'Sessão expirada'],
    api: ['Requisição GET', 'Erro 404', 'Timeout'],
    system: ['Backup iniciado', 'Memória crítica', 'Cache limpo'],
  };
  const testMsgs: Record<LogCategory, string[]> = {
    auth: ['[TESTE] Tentativa de login', '[TESTE] Verificando sessão'],
    api: ['[TESTE] GET /api/test', '[TESTE] Mock response'],
    system: ['[TESTE] Inicializando módulo', '[TESTE] Simulação'],
  };
  const arr: Log[] = [];

  for (let i = 0; i < 10; i++) {
    const cats: LogCategory[] = ['auth', 'api', 'system'];
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const lvl: LogLevel =
      Math.random() > 0.7 ? (Math.random() > 0.5 ? 'error' : 'warning') : 'info';
    arr.push({
      id: `log-real-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      level: lvl,
      category: cat,
      message: msgs[cat][Math.floor(Math.random() * msgs[cat].length)],
      isTest: false,
    });
  }

  for (let i = 0; i < 10; i++) {
    const cats: LogCategory[] = ['auth', 'api', 'system'];
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const lvl: LogLevel = Math.random() > 0.8 ? 'warning' : 'info';
    arr.push({
      id: `log-test-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      level: lvl,
      category: cat,
      message: testMsgs[cat][Math.floor(Math.random() * testMsgs[cat].length)],
      isTest: true,
    });
  }

  return arr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
}

function getFilteredLogs() {
  const search = (
    document.querySelector<HTMLInputElement>('#searchInput')?.value || ''
  ).toLowerCase();
  const level = document.querySelector<HTMLInputElement>('#levelFilter')?.value || '';
  const cat = document.querySelector<HTMLInputElement>('#categoryFilter')?.value || '';
  const showTest = document.querySelector<HTMLInputElement>('#isTestFilter')?.checked || false;

  return logs.filter((l) => {
    const matchSearch = !search || l.message.toLowerCase().includes(search);
    const matchLevel = !level || l.level === level;
    const matchCat = !cat || l.category === cat;
    const matchTest = showTest ? l.isTest === true : l.isTest !== true;
    return matchSearch && matchLevel && matchCat && matchTest;
  });
}

const LEVEL_COLORS: Record<LogLevel, { bg: string; color: string }> = {
  info: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  warning: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  success: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
};

const renderLogRow = (l: Log): string => {
  const colors = LEVEL_COLORS[l.level];
  return `
    <tr data-id="${l.id}">
      <td class="log-timestamp text-sm">${formatDateTime(l.timestamp)}</td>
      <td><span class="badge log-level" style="background:${colors.bg};color:${colors.color}">${l.level}</span></td>
      <td class="log-category">${l.category}</td>
      <td class="log-message">${l.message}</td>
      <td>
        <button class="action-btn detail-btn" data-id="${l.id}" title="Ver detalhes">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  `;
};

function render() {
  const filtered = getFilteredLogs();
  const tbody = document.getElementById('logsTableBody') as HTMLTableSectionElement;
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8">Nenhum log</td></tr>`;
    updateStats([]);
    return;
  }

  tbody.innerHTML = filtered.slice(0, 100).map(renderLogRow).join('');
  tbody
    .querySelectorAll('.detail-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () => showDetail((btn as HTMLElement).dataset.id!))
    );
  updateStats(filtered);
}

function updateStats(filtered: Log[]) {
  const totalEl = document.querySelector("[data-stat='total']") as HTMLElement;
  const errorsEl = document.querySelector("[data-stat='errors']") as HTMLElement;
  const warningsEl = document.querySelector("[data-stat='warnings']") as HTMLElement;
  const lastUpdateEl = document.querySelector("[data-stat='lastUpdate']") as HTMLElement;

  if (totalEl) totalEl.textContent = String(filtered.length);
  if (errorsEl) errorsEl.textContent = String(filtered.filter((l) => l.level === 'error').length);
  if (warningsEl)
    warningsEl.textContent = String(filtered.filter((l) => l.level === 'warning').length);
  if (lastUpdateEl)
    lastUpdateEl.textContent = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
}

function showDetail(id: string) {
  const l = logs.find((x) => x.id === id);
  if (!l) return;
  const detailContent = document.getElementById('detailContent');
  if (detailContent) {
    detailContent.innerHTML = `
      <div class="info-row"><span>ID</span><code>${l.id}</code></div>
      <div class="info-row"><span>Timestamp</span>${formatDateTime(l.timestamp)}</div>
      <div class="info-row"><span>Nível</span>${l.level}</div>
      <div class="info-row"><span>Categoria</span>${l.category}</div>
      <div class="info-row"><span>Mensagem</span>${l.message}</div>
    `;
  }
  openModal('detailModal');
}

function clearLogs() {
  logs = [];
  save();
  render();
  closeModal('clearModal');
}

function exportLogs() {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

export function initLogsAdmin() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.length > 0 && parsed[0].isTest === undefined) {
      localStorage.removeItem(STORAGE_KEY);
      logs = generateMockLogs();
      save();
    } else {
      logs = parsed;
    }
  } else {
    logs = generateMockLogs();
    save();
  }

  document.getElementById('searchInput')?.addEventListener('input', render);
  document.getElementById('levelFilter')?.addEventListener('change', render);
  document.getElementById('categoryFilter')?.addEventListener('change', render);
  document.getElementById('isTestFilter')?.addEventListener('change', render);
  document.getElementById('clearBtn')?.addEventListener('click', () => openModal('clearModal'));
  document
    .getElementById('cancelClearBtn')
    ?.addEventListener('click', () => closeModal('clearModal'));
  document.getElementById('confirmClearBtn')?.addEventListener('click', clearLogs);
  document.getElementById('exportBtn')?.addEventListener('click', exportLogs);

  initModals();
  render();
}


import type {
  CauHoi,
  CauTrucDeThi,
  MatranCell,
  KhoiKienThuc,
  ExamGenResult,
  ExamGenError,
  DeThi,
} from './types';




function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


export function generateExam(
  cauTruc: CauTrucDeThi,
  allQuestions: CauHoi[],
  khoiKienThucs: KhoiKienThuc[],
  excludeIds?: string[],
): ExamGenResult {
  const errors: ExamGenError[] = [];
  const selectedIds: string[] = [];

  const monHocQuestions = allQuestions.filter((q) => q.monHocId === cauTruc.monHocId);
  const excludeSet = new Set(excludeIds || []);

  for (const cell of cauTruc.matran) {
    if (cell.soLuong <= 0) continue;

    const candidates = monHocQuestions.filter(
      (q) =>
        q.khoiKienThucId === cell.khoiKienThucId &&
        q.mucDoKho === cell.mucDoKho &&
        !excludeSet.has(q.id) &&
        !selectedIds.includes(q.id),
    );

    if (candidates.length < cell.soLuong) {
      const kkt = khoiKienThucs.find((k) => k.id === cell.khoiKienThucId);
      errors.push({
        khoiKienThucId: cell.khoiKienThucId,
        khoiKienThucTen: kkt?.ten || 'Không rõ',
        mucDoKho: cell.mucDoKho,
        required: cell.soLuong,
        available: candidates.length,
      });
    } else {
      const picked = shuffle(candidates).slice(0, cell.soLuong);
      selectedIds.push(...picked.map((q) => q.id));
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const selectedQuestions = allQuestions.filter((q) => selectedIds.includes(q.id));
  const tongDiem = selectedQuestions.reduce((sum, q) => sum + q.diem, 0);
  const tongThoiGian = selectedQuestions.reduce((sum, q) => sum + q.thoiGianPhut, 0);

  return {
    success: true,
    cauHoiIds: selectedIds,
    tongDiem,
    tongThoiGian,
  };
}


export function calcMatranSummary(
  matran: MatranCell[],
  allQuestions: CauHoi[],
  monHocId: string,
): { tongCau: number; tongDiem: number; tongThoiGian: number } {
  let tongCau = 0;
  let tongDiem = 0;
  let tongThoiGian = 0;

  for (const cell of matran) {
    tongCau += cell.soLuong;

    const matched = allQuestions.filter(
      (q) =>
        q.monHocId === monHocId &&
        q.khoiKienThucId === cell.khoiKienThucId &&
        q.mucDoKho === cell.mucDoKho,
    );

    if (matched.length > 0) {
      const avgDiem = matched.reduce((s, q) => s + q.diem, 0) / matched.length;
      const avgTime = matched.reduce((s, q) => s + q.thoiGianPhut, 0) / matched.length;
      tongDiem += avgDiem * cell.soLuong;
      tongThoiGian += avgTime * cell.soLuong;
    }
  }

  return {
    tongCau,
    tongDiem: Math.round(tongDiem * 10) / 10,
    tongThoiGian: Math.round(tongThoiGian),
  };
}



export interface DuplicateResult {
  examA: string;
  examB: string;
  commonIds: string[];
  totalA: number;
  totalB: number;
  percentA: number;
  percentB: number;
}


export function checkDuplicate(examA: DeThi, examB: DeThi): DuplicateResult {
  const setA = new Set(examA.cauHoiIds);
  const setB = new Set(examB.cauHoiIds);
  const commonIds = examA.cauHoiIds.filter((id) => setB.has(id));

  return {
    examA: examA.id,
    examB: examB.id,
    commonIds,
    totalA: examA.cauHoiIds.length,
    totalB: examB.cauHoiIds.length,
    percentA: examA.cauHoiIds.length > 0 ? Math.round((commonIds.length / examA.cauHoiIds.length) * 100) : 0,
    percentB: examB.cauHoiIds.length > 0 ? Math.round((commonIds.length / examB.cauHoiIds.length) * 100) : 0,
  };
}




export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


export function readJSONFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch (e) {
        reject(new Error('File JSON không hợp lệ'));
      }
    };
    reader.onerror = () => reject(new Error('Không đọc được file'));
    reader.readAsText(file);
  });
}

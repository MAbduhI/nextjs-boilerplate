export type Locale = "id" | "en";

export const translations = {
  id: {
    // Navigation
    "nav.main": "UTAMA",
    "nav.dashboard": "Executive Dashboard",
    "nav.workspace": "My Workspace (ESS)",
    "nav.time": "WAKTU & PRESENSI",
    "nav.attendance": "Presensi & Geofence",
    "nav.calendar": "Timesheet Kalender",
    "nav.leaves": "Cuti & Izin",
    "nav.talent": "TALENTA & ORGANISASI",
    "nav.employees": "Direktori & Org-Tree",
    "nav.ninebox": "9-Box Talent Matrix",
    "nav.finance": "FINANSIAL & ADMINISTRASI",
    "nav.payroll": "Payroll & Slip Gaji",
    "nav.reimbursement": "Klaim Reimbursement",
    "nav.letters": "Surat Resmi & SP",
    "nav.notes": "Catatan & Agenda",
    "nav.recruitment": "Rekrutmen & ATS",
    "nav.system": "SISTEM & KONFIGURASI",
    "nav.settings": "Pengaturan Sistem",
    "nav.wfh": "Kebijakan WFH",
    "nav.holidays": "Tanggal Merah & Libur",
    "nav.leaveTypes": "Master Tipe Cuti (Enum)",
    "nav.letterTypes": "Master Tipe Surat (Enum)",
    "nav.widgets": "Grid & Widget DND",

    // Common & Header
    "header.pwa": "Pasang PWA",
    "header.refresh": "Muat Ulang Data",
    "header.themeLight": "Ganti ke Light Mode",
    "header.themeDark": "Ganti ke Dark Mode",
    "header.language": "Pilih Bahasa",
    "header.roleMode": "Ganti Mode Peran:",
    "header.themeLabel": "Tema Antarmuka",
    "header.logout": "Keluar dari Akun",
    "header.accountMenu": "Menu Akun & Peran",
  },
  en: {
    // Navigation
    "nav.main": "MAIN",
    "nav.dashboard": "Executive Dashboard",
    "nav.workspace": "My Workspace (ESS)",
    "nav.time": "TIME & ATTENDANCE",
    "nav.attendance": "Attendance & Geofence",
    "nav.calendar": "Timesheet Calendar",
    "nav.leaves": "Leaves & Permits",
    "nav.talent": "TALENT & ORGANIZATION",
    "nav.employees": "Directory & Org-Tree",
    "nav.ninebox": "9-Box Talent Matrix",
    "nav.finance": "FINANCIAL & ADMINISTRATION",
    "nav.payroll": "Payroll & Payslips",
    "nav.reimbursement": "Expense Claims",
    "nav.letters": "Official Letters & SP",
    "nav.notes": "Notes & Workspace",
    "nav.recruitment": "Recruitment & ATS",
    "nav.system": "SYSTEM & CONFIGURATION",
    "nav.settings": "System Settings",
    "nav.wfh": "WFH Hybrid Policy",
    "nav.holidays": "Public Holidays",
    "nav.leaveTypes": "Leave Types (Enum)",
    "nav.letterTypes": "Letter Types (Enum)",
    "nav.widgets": "Grid & Widget DND",

    // Common & Header
    "header.pwa": "Install PWA",
    "header.refresh": "Refresh Data",
    "header.themeLight": "Switch to Light Mode",
    "header.themeDark": "Switch to Dark Mode",
    "header.language": "Select Language",
    "header.roleMode": "Switch Role Persona:",
    "header.themeLabel": "Color Theme",
    "header.logout": "Sign Out",
    "header.accountMenu": "Account & Role Menu",
  },
};

export function getTranslation(locale: Locale, key: string, fallback?: string): string {
  const dict = translations[locale] || translations.id;
  return (dict as any)[key] || fallback || key;
}

/**
 * Google Apps Script สำหรับบันทึกข้อมูลฟอร์ม RSVP และคำอวยพร ลงใน Google Sheets อัตโนมัติ
 *
 * วิธีติดตั้ง (ใช้เวลา 1 นาที):
 * 1. เปิด Google Sheets แผ่นใหม่ที่ https://sheets.new (หรือเปิดไฟล์ Google Sheets ที่ต้องการ)
 * 2. ไปที่เมนูด้านบน: Extensions (ส่วนขยาย) > Apps Script
 * 3. ลบโค้ดเดิมออกทั้งหมด แล้ววางโค้ดด้านล่างนี้ลงไป กด Save (ไอคอนแผ่นดิสก์ หรือ Ctrl+S / Cmd+S)
 * 4. กดปุ่มสีน้ำเงินมุมขวาบน "Deploy" (ทำให้ใช้งานได้) > "New deployment" (การทำให้ใช้งานได้รายการใหม่)
 * 5. กดรูปเฟือง ⚙️ ข้างคำว่า Select type แล้วเลือก "Web app" (เว็บแอป)
 * 6. ตั้งค่าดังนี้:
 *    - Description: Wedding RSVP
 *    - Execute as (ดำเนินการในฐานะ): "Me" (ฉัน)
 *    - Who has access (ผู้ที่มีสิทธิ์เข้าถึง): เลือกเป็น "Anyone" (ทุกคน) **สำคัญมาก**
 * 7. กดปุ่ม "Deploy" > กด Authorize access (ให้สิทธิ์เข้าถึง) > เลือกบัญชี Google ของคุณ > กด Advanced > Go to Untitled project (unsafe) > Allow
 * 8. คัดลอก "Web app URL" (ที่ขึ้นต้นด้วย https://script.google.com/macros/s/....../exec)
 * 9. นำ URL ที่ได้ไปวางในไฟล์ src/data/weddingData.js ที่ช่อง googleSheetWebAppUrl
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // สร้างหัวตารางอัตโนมัติหากแผ่นงานยังว่างอยู่
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "วัน-เวลาที่ส่ง (Timestamp)",
        "ประเภท (Type)",
        "ชื่อ-นามสกุล (Full Name)",
        "เบอร์ติดต่อ (Contact)",
        "การเข้าร่วม (Attending)",
        "จำนวนแขก (Guests Count)",
        "คำอวยพร (Wishes)"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#EBF4FE");
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      data.type || "RSVP",
      data.fullName || "-",
      data.contact || "-",
      data.attending || "-",
      data.guestCount !== undefined ? data.guestCount : 1,
      data.wishes || "-"
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

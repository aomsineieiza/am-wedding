/**
 * =========================================================================
 * GOOGLE APPS SCRIPT FOR WEDDING RSVP (AOMSIN & MILD)
 * =========================================================================
 * 
 * วิธีตั้งค่า (ใช้ได้ทั้งเปิดจากใน Sheet หรือเปิดแยกที่ https://script.google.com):
 * 1. เปิด https://script.google.com > กด "+ New project" (หรือใน Google Sheet กด Extensions > Apps Script)
 * 2. ลบโค้ดเดิมออกทั้งหมด แล้ววางโค้ดนี้ลงไป กด Save (Cmd/Ctrl + S)
 * 3. ทดสอบสิทธิ์ครั้งแรก: เลือกฟังก์ชัน "testRun" หรือ "testWriteRow" ด้านบน แล้วกดปุ่ม "Run (เรียกใช้)"
 * 4. กดปุ่มสีน้ำเงิน "Deploy (ทำให้ใช้งานได้)" มุมขวาบน > "New deployment (การทำให้ใช้งานได้รายการใหม่)"
 * 5. กดรูปเฟือง ⚙️ ข้างคำว่า Select type เลือก "Web app (เว็บแอป)"
 * 6. ตั้งค่า:
 *    - Description: "Aomsin & Mild Wedding RSVP"
 *    - Execute as: "Me" (ฉัน)
 *    - Who has access: "Anyone" (ทุกคน) <-- สำคัญมาก!
 * 7. กด "Deploy" แล้วคัดลอก "Web app URL" (ที่ลงท้ายด้วย /exec) มาใส่ในโปรเจกต์
 */

var SPREADSHEET_ID = '1m9eZPR10c332_g9u1wLnhqL7hFH55oC4cLN5ateoNM4';

function getTargetSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * กด Run ที่ฟังก์ชันนี้เพื่อทดสอบการเชื่อมต่อและอนุญาตสิทธิ์ Google Sheet
 */
function testRun() {
  var ss = getTargetSpreadsheet();
  if (!ss) {
    Logger.log('❌ Error: ไม่พบไฟล์ Spreadsheet กรุณาตรวจสอบ SPREADSHEET_ID');
    return;
  }
  Logger.log('✅ เชื่อมต่อกับ Spreadsheet สำเร็จ: ' + ss.getName());
}

/**
 * กด Run ที่ฟังก์ชันนี้เพื่อทดสอบเขียนข้อมูลจำลอง 1 แถวลงใน Google Sheet จริง
 */
function testWriteRow() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        type: 'RSVP',
        attending: 'ยินดีเข้าร่วมงาน (Yes)',
        fullName: 'คุณกานต์ พิชญา (ทดสอบระบบ)',
        contact: '081-234-5678',
        guestCount: 2,
        wishes: 'ยินดีกับออมสินและมายด์ด้วยนะค้าบ ขอให้มีความสุขมากๆ!'
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log('ผลลัพธ์การเขียนข้อมูล: ' + result.getContent());
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Aomsin & Mild Wedding RSVP Webhook is active and running.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Server is busy, please try again in a few seconds.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = getTargetSpreadsheet();
    if (!ss) {
      throw new Error('Spreadsheet not found. Please check SPREADSHEET_ID.');
    }

    var sheetName = 'RSVP';
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    var headers = [
      'วันเวลาที่ลงทะเบียน (Timestamp)',
      'สถานะการเข้าร่วม (Attending)',
      'ชื่อ-นามสกุล (Full Name)',
      'เบอร์โทรศัพท์ / ติดต่อ (Contact)',
      'จำนวนผู้ร่วมงาน (Guest Count)',
      'คำอวยพรแด่คู่บ่าวสาว (Wishes)'
    ];

    // สร้างหัวตารางพร้อมตกแต่งสีอัตโนมัติเมื่อแผ่นงานยังว่าง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);

      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0074E2');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    var rawData = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var payload = JSON.parse(rawData);

    var formattedDate = Utilities.formatDate(
      new Date(),
      'Asia/Bangkok',
      'yyyy-MM-dd HH:mm:ss'
    );

    // ป้องกันเลข 0 นำหน้าเบอร์โทรหายใน Google Sheets
    var contactText = payload.contact || payload.phone || '-';
    var formattedContact = contactText !== '-' ? "'" + String(contactText).trim() : '-';

    var fullNameText = payload.fullName || ((payload.firstName || '') + ' ' + (payload.lastName || '')).trim() || '-';

    var row = [
      formattedDate,
      payload.attending || 'ยินดีเข้าร่วมงาน (Yes)',
      fullNameText,
      formattedContact,
      payload.guestCount !== undefined ? payload.guestCount : 1,
      payload.wishes || '-'
    ];

    sheet.appendRow(row);

    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, headers.length);
    rowRange.setVerticalAlignment('middle');

    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP recorded successfully',
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

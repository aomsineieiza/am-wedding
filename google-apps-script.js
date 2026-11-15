/**
 * =========================================================================
 * GOOGLE APPS SCRIPT FOR WEDDING RSVP (AOMSIN & MILD)
 * =========================================================================
 */

var SPREADSHEET_ID = '1m9eZPR10c332_g9u1wLnhqL7hFH55oC4cLN5ateoNM4';

function getTargetSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * กด Run ที่ฟังก์ชันนี้เพื่อล้างหัวตารางเก่า 10 ช่อง และสร้างหัวตารางใหม่ 6 ช่องให้ตรงกับฟอร์มเว็บทันที
 */
function resetSheetHeaders() {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
  sheet.clear();

  var headers = [
    'วันเวลาที่ลงทะเบียน (Timestamp)',
    'สถานะการเข้าร่วม (Attending)',
    'ชื่อ-นามสกุล (Full Name)',
    'ชื่อเล่น (Nickname)',
    'เบอร์โทรศัพท์ / ติดต่อ (Contact)',
    'จำนวนผู้ร่วมงาน (Guest Count)',
    'คำอวยพรแด่คู่บ่าวสาว (Wishes)'
  ];

  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0074E2');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  for (var col = 1; col <= headers.length; col++) {
    sheet.autoResizeColumn(col);
  }
  Logger.log('✅ ล้างตารางเก่าและตั้งค่าหัวตารางใหม่ 6 ช่องเรียบร้อยแล้ว!');
}

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

    // ตรวจสอบว่าถ้าแถวที่ 1 ยังว่าง หรือยังเป็นหัวตารางเก่า (ทีม / ชื่อเล่น / อาหารที่แพ้) ให้เขียนหัวตารางใหม่ 6 ช่องทับทันที
    var firstCellB = sheet.getLastRow() > 0 ? String(sheet.getRange(1, 2).getValue()) : '';
    if (sheet.getLastRow() === 0 || firstCellB.indexOf('ทีม') !== -1) {
      if (sheet.getLastRow() > 0) {
        sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent().clearFormat();
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
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

    var contactText = payload.contact || payload.phone || '-';
    var formattedContact = contactText !== '-' ? "'" + String(contactText).trim() : '-';
    var fullNameText = payload.rawFullName || payload.fullName || ((payload.firstName || '') + ' ' + (payload.lastName || '')).trim() || '-';

    var row = [
      formattedDate,
      payload.attending || 'ยินดีเข้าร่วมงาน (Yes)',
      fullNameText,
      payload.nickname || '-',
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

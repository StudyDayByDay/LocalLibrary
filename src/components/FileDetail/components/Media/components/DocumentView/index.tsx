/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* 
只能支持docx和xls、xlsx、pdf，ppt支持不了
*/
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {renderAsync} from 'docx-preview';
import {HotTable} from '@handsontable/react';
import * as XLSX from 'xlsx';
import 'handsontable/dist/handsontable.full.css';
import {GridSettings} from 'node_modules/handsontable/settings';
import {registerAllModules} from 'handsontable/registry';

registerAllModules();

const DocumentViewBox = styled.div`
  width: 100%;
  height: 100%;
  .word-box {
    width: 100%;
    height: 100%;
  }
  .excel-box {
    width: 100%;
    height: 100%;
    .sheet-box {
      width: 100%;
      height: 35px;
      overflow-x: auto;
      display: flex;
      align-items: end;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      background-color: #f1f1f1;
      padding-left: 10px;
      &-item {
        padding: 5px 30px;
        margin-right: 5px;
        border: 1px solid #ccc;
        border-bottom: none;
        background-color: #eaeaea;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 14px;
        color: #333;
        border-radius: 3px 3px 0 0;
        transition: background-color 0.3s ease;
        &:hover {
          background-color: #ddd;
        }
        &.active {
          background-color: #fff;
          border-bottom: 1px solid #fff;
          font-weight: bold;
          color: #000;
        }
      }
    }
  }
  .pdf-box {
    width: 100%;
    height: 100%;
  }
`;

export default function DocumentView({file}: {file: File}) {
  const notSupport = ['doc', 'ppt', 'pptx'];
  const [type, setType] = useState('');
  const wordRef = useRef<HTMLDivElement>(null);
  const [hotSettings, setHotSettings] = useState<GridSettings>({
    data: [],
    colHeaders: true,
    rowHeaders: true,
    mergeCells: [],
  });
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheetName, setCurrentSheetName] = useState('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook>();
  const [pdfSrc, setPdfSrc] = useState('');

  const handleWord = async () => {
    if (wordRef.current) {
      wordRef.current.innerHTML = '';
    }
    const arrayBuffer = await file.arrayBuffer();
    await renderAsync(arrayBuffer, wordRef.current!);
  };

  const handleExcel = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer) {
        const workbookData = XLSX.read(arrayBuffer, {type: 'array'});
        console.log(workbookData, 'workbookData');
        setWorkbook(workbookData);
      }
    };
    reader.readAsArrayBuffer(file); // 读取文件
  };

  const handleSetExcelData = (sheetName: string) => {
    const worksheet = workbook?.Sheets[sheetName] as XLSX.WorkSheet;
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1});

    setCurrentSheetName(sheetName);
    console.log(workbook, 'workbook');
    console.log(worksheet, 'worksheet');
    // 设置单元格合并情况
    const merges = worksheet['!merges'] || [];
    console.log(merges, 'merges');
    const formattedMerges = merges.map(
      (merge: {
        s: {r: number; c: number}; // 起始单元格 (start)
        e: {r: number; c: number}; // 结束单元格 (end)
      }) => ({
        row: merge.s.r,
        col: merge.s.c,
        rowspan: merge.e.r - merge.s.r + 1,
        colspan: merge.e.c - merge.s.c + 1,
      })
    );
    console.log(formattedMerges, 'formattedMerges');
    console.log(jsonData, 'jsonData');
    merges.forEach((merge) => {
      const startRow = merge.s.r;
      const startCol = merge.s.c;
      const endRow = merge.e.r;
      const endCol = merge.e.c;

      const value = jsonData[startRow][startCol]; // 获取合并起始单元格的值

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          jsonData[row][col] = value; // 填充所有合并的单元格
        }
      }
    });
    setHotSettings({
      data: jsonData,
      colHeaders: true,
      rowHeaders: true,
      mergeCells: formattedMerges,
    });
  };

  const handlePDF = () => {
    pdfSrc && URL.revokeObjectURL(pdfSrc);
    setPdfSrc(URL.createObjectURL(file));
  };

  useEffect(() => {
    const type = file.name.split('.')[1];
    setType(type);
    type === 'docx' && handleWord();
    (type === 'xls' || type === 'xlsx') && handleExcel();
    type === 'pdf' && handlePDF();
  }, [file]);

  useEffect(() => {
    if (workbook) {
      handleSetExcelData(workbook!.SheetNames[0]);
      setSheetNames(workbook!.SheetNames);
      setCurrentSheetName(workbook!.SheetNames[0]);
    }
    console.log(workbook, 'workbook');
  }, [workbook]);

  return (
    <>
      {notSupport.includes(type) ? (
        <span>暂不支持此类型文件，目前支持docx、xls、xlsx、pdf</span>
      ) : (
        <DocumentViewBox>
          {type === 'docx' && <div className="word-box" ref={wordRef}></div>}
          {(type === 'xls' || type === 'xlsx') && (
            <div className="excel-box">
              <div className="sheet-box">
                {sheetNames.map((sheetName) => {
                  return (
                    <div key={sheetName} className={`sheet-box-item ${sheetName === currentSheetName ? 'active' : ''}`} onClick={() => handleSetExcelData(sheetName)}>
                      {sheetName}
                    </div>
                  );
                })}
              </div>
              <HotTable settings={hotSettings} height="auto" stretchH="all" licenseKey="non-commercial-and-evaluation" />
            </div>
          )}
          {type === 'pdf' && <embed className="pdf-box" src={pdfSrc} type={file.type} />}
        </DocumentViewBox>
      )}
    </>
  );
}

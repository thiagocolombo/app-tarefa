import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

if ((pdfFonts as any).pdfMake?.vfs) {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
} else if ((pdfFonts as any).default?.pdfMake?.vfs) {
  (pdfMake as any).vfs = (pdfFonts as any).default.pdfMake.vfs;
} else {
  console.log('não foi possível encontrar "vfs"', pdfFonts);
}

export default pdfMake;

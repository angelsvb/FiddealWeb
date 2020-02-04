package org.example;

import javax.print.*;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttribute;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.attribute.standard.MediaPrintableArea;
import javax.print.attribute.standard.PrinterResolution;
import java.awt.*;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.awt.print.PrinterException;
import java.awt.print.PrinterJob;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PrinterService implements Printable {
    public List<String> getPrinters(){
        DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;
        PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();

        PrintService printServices[] = PrintServiceLookup.lookupPrintServices(
                flavor, pras);

        List<String> printerList = new ArrayList<String>();
        for(PrintService printerService: printServices){
            printerList.add( printerService.getName());
        }

        return printerList;
    }

    @Override
    public int print(Graphics g, PageFormat pf, int page) {
        if (page > 0) return NO_SUCH_PAGE;

        Graphics2D g2d = (Graphics2D) g;
        g2d.translate(pf.getImageableX(), pf.getImageableY());

        g.setFont(new Font("Serif", Font.PLAIN, 12));
        g.drawString("Hello world 1!", 0, 1);
        g.setFont(new Font("Serif", Font.PLAIN, 14));
        g.drawString("Hello world 2!", 50, 12);
        g.setFont(new Font("Serif", Font.PLAIN, 16));
        g.drawString("Hello world 3!", 100, 26);
        g.setFont(new Font("Serif", Font.PLAIN, 18));
        g.drawString("Hello world 4!", 200, 40);

        return PAGE_EXISTS;
    }

    public void printString(String printerName, String text) {
        DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;
        PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();

        PrintService[] printService = PrintServiceLookup.lookupPrintServices(flavor, pras);
        PrintService service = findPrintService(printerName, printService);

        try {

            PrinterJob job = PrinterJob.getPrinterJob();
            job.setPrintable(this);
            job.print();

            //https://docs.oracle.com/javase/tutorial/2d/printing/examples/HelloWorldPrinter.java
            //this.print(job.getGraphics(), new PageFormat(), 0);
            //job.print();

            /*assert service != null;
            DocPrintJob job = service.createPrintJob();

            byte[] bytes;

            bytes = text.getBytes("CP437");
            Doc doc = new SimpleDoc(bytes, flavor, null);
            job.print(doc, null);*/
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Integer LINE_CHARS = 32;
    private static String LF_CR = "\n";
    private static String HR_LINE = "- - - - - - - - - - - - - - - - "+LF_CR;
    private static String HR_LINE_DOTS = ". . . . . . . . . . . . . . . . "+LF_CR;
    private static String BUSINESS_NAME = "Empresa:"+LF_CR;
    private static String PURCHASE_NUMBER = "Compra número:"+LF_CR;
    private static String PURCHASE_DATE = "Fecha de compra:"+LF_CR;
    private static String INVOICE_SUBTOTAL = "Subtotal:";
    private static String INVOICE_DISCOUNT = "Descuento aplicado:";
    private static String INVOICE_TOTAL = "Total:";
    private static String PRODUCT_COLUMN = "Producto";
    private static String INVOICE_END = LF_CR+LF_CR+LF_CR+LF_CR;
    private static String EUR = "EUR";

    private static String INVOICE_TEXT = "Grácias por su compra. "+"Recuerde que se acepta el cambio o devolución de sus productos en un plazo máximo de "+
            "un MES (30 días) desde la fecha de compra, siempre que estos no hayan sido usados. "+
            "El importe se devolverà en el mismo modo en el que ha sido abonado.";


    private static String repeatChar(char c,int times){
        return new String(new char[times]).replace('\0', c);
    }

    private static String getFormattedString(String value,Integer length){
        int times = 0;
        if (length-value.length() > 0) times = length-value.length();
        return value+repeatChar(' ',times);
    }

    private static String getProductsString(List<Product> products){
        String oRes = "";
        int i =0;
        for(Product product : products){
            oRes += getFormattedString(product.Name,LINE_CHARS-product.Price.length())+product.Price+LF_CR;
            String aux = "       " + product.Amount + " * " + product.Price;
            oRes += getFormattedString("",LINE_CHARS-aux.length()-4)+aux;
            i += 1;
        }
        return oRes;
    }

    public void printImage(String printerName) {
        try{
            DocFlavor flavor = DocFlavor.INPUT_STREAM.PNG;
            PrintRequestAttributeSet aset = new HashPrintRequestAttributeSet();
            aset.add(new PrinterResolution(205, 205, PrinterResolution.DPI));
            aset.add(new MediaPrintableArea(0, 0, 48, 48, MediaPrintableArea.MM));
            PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
            for (PrintService printService : services) {
                if (printService.getName().equals(printerName)) {
                    DocPrintJob pj = printService.createPrintJob();
                    FileInputStream fis = new FileInputStream("C:\\Users\\pavel\\GitHub\\TFG\\Vectorials\\g40.png");
                    Doc doc = new SimpleDoc(fis, flavor, null);
                    pj.print(doc, aset);
                }
            }
        } catch (Exception e){

        }
    }

    public static void printTicket(Ticket t, Ticket.Type type){
        PrinterService printerService = new PrinterService();

        //String str = HR_LINE+HR_LINE+BUSINESS_NAME+ t.Name + " - " + t.CIF +LF_CR+ t.Address + " - " + t.Municipi +LF_CR+LF_CR;
        //str += PURCHASE_NUMBER+ t.PurchaseID +LF_CR+LF_CR + PURCHASE_DATE+ t.PurchaseDate + LF_CR + HR_LINE;
        //str += getFormattedString(PRODUCT_COLUMN,LINE_CHARS-EUR.length())+EUR+LF_CR+ HR_LINE_DOTS+LF_CR;
        //str += getProductsString(t.JSONProducts)+LF_CR+ HR_LINE_DOTS+LF_CR;
        //str += getFormattedString(INVOICE_SUBTOTAL,LINE_CHARS-(t.Subtotal+" EUR").length())+t.Subtotal+" EUR\n";
        //str += getFormattedString(INVOICE_DISCOUNT,LINE_CHARS-(t.Discount+" EUR").length())+t.Discount+" EUR\n";
        //str += getFormattedString(INVOICE_TOTAL,LINE_CHARS-(t.Total+" EUR").length())+t.Total+" EUR\n"+ HR_LINE+LF_CR;
        //str += "Còdigo cliente:\n"+ t.UserID + LF_CR + "Descuento obtenido:\n"+ t.ObtainedDiscount + " EUR\n";
        //str += "Descuento total acomulado:\n"+ t.TotalDiscount+" EUR\n"+"Caducidad descuento:\n"+t.ExpirationDate+"\n\n"+HR_LINE+LF_CR+HR_LINE_DOTS;
        //str += LF_CR+INVOICE_TEXT+LF_CR+HR_LINE_DOTS+getFormattedString("Recibo generado con Fiddeal",LINE_CHARS)+HR_LINE_DOTS+INVOICE_END;

        //printerService.printImage("EPSON TM-T88IV ReceiptE4");

        String str = repeatChar('#', getLineCharacters(type));;
        str += LF_CR + LF_CR;

        printerService.printString("EPSON TM-T88IV ReceiptE4", str);

        //byte[] cutP = new byte[] { 0x1d, 'V', 1 };
        //printerService.printBytes("EPSON TM-T88IV ReceiptE4", cutP);
    }


    private static int getLineCharacters(Ticket.Type type){
        switch (type){
            case mm_58: return (int) Math.round(0.55*52);
            case mm_80: return (int) Math.round(0.55*80);
            default: return 0;
        }
    }

    public void printBytes(String printerName, byte[] bytes) {

        DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;
        PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();

        PrintService printService[] = PrintServiceLookup.lookupPrintServices(flavor, pras);
        PrintService service = findPrintService(printerName, printService);

        DocPrintJob job = service.createPrintJob();

        try {
            Doc doc = new SimpleDoc(bytes, flavor, null);

            job.print(doc, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private PrintService findPrintService(String printerName,
                                          PrintService[] services) {
        for (PrintService service : services) {
            if (service.getName().equalsIgnoreCase(printerName)) {
                return service;
            }
        }

        return null;
    }
}
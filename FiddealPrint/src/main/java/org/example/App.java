package org.example;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

/**
 * JavaFX App
 */
public class App extends Application {
    @Override
    public void start(Stage stage) {
        var javaVersion = SystemInfo.javaVersion();
        var javafxVersion = SystemInfo.javafxVersion();

        var label = new Label("Hello, JavaFX " + javafxVersion + ", running on Java " + javaVersion + ".");
        var scene = new Scene(new StackPane(label), 640, 480);
        stage.setScene(scene);
        stage.show();

        initializePrintingServer();
    }

    public static void main(String[] args) {
        launch();
    }

    private static final int PORT = 8084;
    private static final String PRINTING_PATH = "/printService";
    private static final String CASH_PATH = "/openCashService";

    public static HttpServer printingServer = null;

    public void initializePrintingServer(){
        System.out.println("Creating printing service...");
        try{
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
            server.createContext(PRINTING_PATH, new PrintHandler());
            server.createContext(CASH_PATH, new CashHandler());
            server.setExecutor(null);
            server.start();
            System.out.println("Printing service RUNNING - PORT: " + PORT);
        } catch (Exception e){
            System.out.println("Printing service ERROR - " + e.getMessage());
        }
    }

    static class CashHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {}
    }

    static class PrintHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            try {
                InputStream requestBody = t.getRequestBody();

                BufferedReader br = new BufferedReader(new InputStreamReader(requestBody, StandardCharsets.UTF_8));
                String a = br.lines().collect(Collectors.joining(System.lineSeparator()));

                a = URLDecoder.decode(a, "UTF-8");

                //a = a.replace("=", "\":\"");
                //a = a.replace("&", "\",\"");
                //a = "{\"" + a + "\"}";
                //a = a.replace("\"[", "[");
                //a = a.replace("]\"", "]");

                System.out.println(a);

                //int auxIndex = a.indexOf("JSONProducts");
                //System.out.println(auxIndex);
                //String b = a.substring(0, auxIndex - 3) + "\"}";
                //String c = "{\"products\":" + a.substring(auxIndex + 14, a.length() - 1) + "}";

                //System.out.println(b);

                //System.out.println(c);

                Gson g = new Gson();
                Ticket p = g.fromJson(a, Ticket.class);

                //System.out.println(p.JSONProducts);

                //p.Products = g.fromJson(c, ProductsArray.class).products;

                System.out.println("ok");

                PrinterService.printTicket(p, Ticket.Type.mm_80);

                String response = "{\"ResultOK\": true,\"Message\":\"ss\",\"ErrorCode\":0}";
                t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
                t.getResponseHeaders().add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                t.sendResponseHeaders(200, response.length());

                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println(e.getStackTrace().toString());

                String response = "{\"ResultOK\": false,\"Message\":\"error printing\",\"ErrorCode\":0}";
                t.sendResponseHeaders(200, response.length());

                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
}
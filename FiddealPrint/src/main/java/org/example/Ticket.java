package org.example;

import java.util.ArrayList;

public class Ticket {
    public enum Type{
        mm_80,
        mm_58
    }

    String CIF = "";
    String Name = "";
    String Address = "";
    String Municipi = "";

    String UserID = "";
    String TotalDiscount = "0.00";
    String ObtainedDiscount = "0.00";
    String ExpirationDate = "";

    String Subtotal = "0.00";
    String Discount = "0.00";
    String Total = "0.00";

    String PurchaseID = "";
    String PurchaseDate = "";

    ArrayList<Product> JSONProducts = new ArrayList<Product>();
    //String JSONProducts = "";
    public Ticket() { }
}

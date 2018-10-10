public class Main {
    public static void main(String[] args) {
        String valueInput = "https://dfk.coh/qweqweq";
        Parser parser = new Parser(valueInput);
        if (parser.getErr().isEmpty()) {
            System.out.println(parser.getUrl());
            System.out.println("Protocol: " + parser.getProtocol());
            System.out.println("Domain: " + parser.getDomain());
            System.out.println("Port: " + parser.getPort());
            System.out.println("Document: " + parser.getDocument());
        } else {
            System.out.println(parser.getErr());
        }
    }
}

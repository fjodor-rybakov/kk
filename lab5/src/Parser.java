import java.lang.reflect.Array;
import java.util.*;

class Parser {
    private String protocol;
    private String domain;
    private short port;
    private String document;
    private String err;

    private Map<String, Short> Protocol = new HashMap<String, Short>();

    private void initProtocol() {
        Protocol.put("HTTP", (short) 80);
        Protocol.put("HTTPS", (short) 443);
    }

    Parser(String url) {
        this.err = getDataFullUrl(url);
    }

    private String getDataFullUrl(String url) {
        if (url.isEmpty()) {
            return "Not found URL";
        }

        String urlParts[] = url.toLowerCase().split("/");

        if (urlParts.length > 0 && urlParts[0] != null) {
            if (urlParts[0].equals("")) {
                return "Incorrect Protocol";
            }
            String protocol = urlParts[0].substring(0, urlParts[0].length() - 1);
            if (!checkProtocol(protocol)) {
                return "Incorrect Protocol";
            }
        } else {
            return "Protocol is empty";
        }

        if (urlParts.length > 1 && urlParts[1] != null && !urlParts[1].equals("")) {
            return "Incorrect URL";
        }

        if (urlParts.length > 2 && urlParts[2] != null) {
            String portParts[] = urlParts[2].split(":");
            if (portParts.length == 0 || !checkDomain(portParts[0])) {
                return "Incorrect Domain";
            }
        } else {
            return "Domain is empty";
        }

        String portParts[] = urlParts[2].split(":");

        if (portParts.length != 1) {
            String port = portParts[1];
            if (!checkPort(port)) {
                return "Incorrect Port";
            }
        } else {
            this.port = Protocol.get(this.protocol.toUpperCase());
        }

        if (urlParts.length > 3 && urlParts[3] != null) {
            String document = url.substring(url.indexOf(urlParts[3]));
            this.document = document.isEmpty() || document.charAt(0) != '/' ? "/" + document : document;
        } else {
            this.document = "/";
        }

        return "";
    }

    private boolean checkProtocol(String protocol) {
        initProtocol();
        if (protocol.equals("http") || protocol.equals("https")) {
            this.protocol = protocol;
            return true;
        }
        return false;
    }

    private boolean checkDomain(String domain) {
        if (domain.length() < 2 || domain.length() > 63) {
            return false; // Содержит не менее 2 и не более 63 символов;
        }

        if (!(Character.isDigit(domain.charAt(0)) || Character.isAlphabetic(domain.charAt(0)))) {
            return false; // Первый символ либо буква, либо цифра
        }

        if (!(Character.isDigit(domain.charAt(domain.length() - 1)) || Character.isAlphabetic(domain.charAt(domain.length() - 1)))) {
            return false; // Последний символ либо буква, либо цифра
        }

        if (!domain.matches("^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,6}$")) {
            return false; //  Не содержат символов, отличных от букв, цифр и дефиса
        }

        if (domain.charAt(2) == '-' && domain.charAt(3) == '-') {
            return false; // Yе содержат одновременно дефисы в 3-й и 4-й позициях.
        }
        this.domain = domain;

        return true;
    }

    private boolean checkPort(String port) {
        try {
            Short port_num = Short.valueOf(port);
            if (port_num <= 1 || port_num >= Short.MAX_VALUE) {
                return false;
            }
            this.port = port_num;
            return true;
        } catch (Exception err) {
            return false;
        }
    }

    String getUrl() {
        String url;
        if (this.document == null) {
            url = this.protocol + "://" + this.domain + ":" + this.getPort();
        } else {
            url = this.protocol + "://" + this.domain + ":" + this.getPort() + this.document;
        }

        return url;
    }

    String getProtocol() {
        return this.protocol;
    }

    short getPort() {
        return this.port;
    }

    String getDomain() {
        return this.domain;
    }

    String getDocument() {
        return this.document;
    }

    String getErr() {
        return this.err;
    }
}

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ParserTest {
    @Test
    void checkIncorrectProtocol() {
        String expect = "Incorrect Protocol";
        Parser parser = new Parser("/sdf");
        assertEquals(expect, parser.getErr());
        expect = "Incorrect Protocol";
        parser = new Parser("hrt://sdf");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkEmptyProtocol() {
        String expect = "Protocol is empty";
        Parser parser = new Parser("//");
        assertEquals(expect, parser.getErr());
        expect = "Incorrect Protocol";
        parser = new Parser("/:");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkCorrectProtocol() {
        String expect = "http";
        Parser parser = new Parser("http://qwerty.ru");
        assertEquals(expect, parser.getProtocol());
        expect = "https";
        parser = new Parser("https://vk.com");
        assertEquals(expect, parser.getProtocol());
        parser = new Parser("hTTps://vk.com");
        assertEquals(expect, parser.getProtocol());
    }

    @Test
    void checkIncorrectDomain() {
        String expect = "Incorrect Domain";
        Parser parser = new Parser("https://_qwe.re&");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://vkwregfruegregrhegiwhoiguhewghoirewhgirhewgkhewgihewiughewrghewrhgihewrghewrheighewghehgewhgoihgihewghrehgrheghewghewrguhghrehgerhgruehgurewgurhewghergureuigheuighrueghruewhgruewhgiuewhguiewhguherguhewrguheruigewghueghkruehguiwhguwherguhewguewghewighrueiwghrueiwhgueiwrhguewrhgrewhgurhewguhewrguhewrui.com");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://qwe.re&");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://qw--е.re&");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://q?%;№wе.re");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://-qwe.re&");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkEmptyDomain() {
        String expect = "Domain is empty";
        Parser parser = new Parser("https://");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https:/");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https:///////////");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkCorrectDomain() {
        String expect = "vk.com";
        Parser parser = new Parser("https://vk.com");
        assertEquals(expect, parser.getDomain());
        parser = new Parser("https://vk.com/qweqweq");
        assertEquals(expect, parser.getDomain());
        expect = "5k.coh";
        parser = new Parser("https://5k.coh/qweqweq");
        assertEquals(expect, parser.getDomain());
    }

    @Test
    void checkIncorrectPort() {
        String expect = "Incorrect Port";
        Parser parser = new Parser("https://vk.com:234234234234");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://vk.com:dfgdfgdfgdrfgdfg");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://vk.com:-1234");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://vk.com:1");
        assertEquals(expect, parser.getErr());
        parser = new Parser("https://vk.com:0");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkEmptyPort() {
        short expect = 443;
        Parser parser = new Parser("https://qwerty.ru");
        assertEquals(expect, parser.getPort());
        expect = 80;
        parser = new Parser("http://goo.ru");
        assertEquals(expect, parser.getPort());
    }

    @Test
    void checkCorrectPort() {
        short expect = 8560;
        Parser parser = new Parser("http://goo.ru:8560");
        assertEquals(expect, parser.getPort());
        expect = 32000;
        parser = new Parser("http://goo.ru:32000");
        assertEquals(expect, parser.getPort());
    }

    @Test
    void checkEmptyDocument() {
        String expect = "/";
        Parser parser = new Parser("https://vk.com");
        assertEquals(expect, parser.getDocument());
        parser = new Parser("https://vk.com/");
        assertEquals(expect, parser.getDocument());
    }

    @Test
    void checkDocument() {
        String expect = "/qweqweqweqwe";
        Parser parser = new Parser("https://vk.com/qweqweqweqwe");
        assertEquals(expect, parser.getDocument());
        expect = "/qweqweqweqwe/";
        parser = new Parser("https://vk.com/qweqweqweqwe/");
        assertEquals(expect, parser.getDocument());
    }

    @Test
    void isEmptyUrl() {
        String expect = "Not found URL";
        Parser parser = new Parser("");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkIncorrectUrl() {
        String expect = "Incorrect URL";
        Parser parser = new Parser("http:/--1/");
        assertEquals(expect, parser.getErr());
        parser = new Parser("http:/ewrewrfewr");
        assertEquals(expect, parser.getErr());
    }

    @Test
    void checkUrl() {
        String expect = "https://vk.com:443/somepath";
        Parser parser = new Parser("https://vk.com/somepath");
        assertEquals(expect, parser.getUrl());
        expect = "http://vk.com:80/somepath";
        parser = new Parser("http://vk.com/somepath");
        assertEquals(expect, parser.getUrl());
        expect = "http://vk.com:3000/somepath";
        parser = new Parser("http://vk.com:3000/somepath");
        assertEquals(expect, parser.getUrl());
    }
}
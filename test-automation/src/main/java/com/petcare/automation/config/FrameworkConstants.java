package com.petcare.automation.config;

import java.time.Duration;

public final class FrameworkConstants {
    private FrameworkConstants() {}

    public static final String APP_URL = System.getProperty("app.url", "http://localhost:3000");
    public static final String DEFAULT_BROWSER = System.getProperty("browser", "chrome");
    public static final boolean HEADLESS = Boolean.parseBoolean(System.getProperty("headless", "false"));

    public static final Duration EXPLICIT_WAIT_TIMEOUT = Duration.ofSeconds(10);
    public static final Duration PAGE_LOAD_TIMEOUT = Duration.ofSeconds(30);
    public static final Duration SCRIPT_TIMEOUT = Duration.ofSeconds(15);

    public static final String REPORT_DIR = System.getProperty("user.dir") + "/reports";
    public static final String REPORT_PATH = REPORT_DIR + "/PetCare_TestReport.html";
    public static final String SCREENSHOTS_DIR = REPORT_DIR + "/screenshots";

    // Test Credentials
    public static final String ADMIN_EMAIL = "admin@petcare.com";
    public static final String ADMIN_PASSWORD = "admin";
    public static final String STAFF_EMAIL = "staff@petcare.com";
    public static final String STAFF_PASSWORD = "staff";
}

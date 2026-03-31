package com.rawat.mvc.controllers;

import com.rawat.mvc.dtos.CountdownResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
public class CountdownController {

    private static final ZoneId INDIA_ZONE = ZoneId.of("Asia/Kolkata");
    private static final ZonedDateTime FY_END_TARGET =
            ZonedDateTime.of(2026, 4, 1, 0, 30, 0, 0, INDIA_ZONE);

    @GetMapping("/api/countdown")
    public CountdownResponse getCountdown() {
        ZonedDateTime now = ZonedDateTime.now(INDIA_ZONE);
        long millisecondsRemaining = Math.max(0, Duration.between(now, FY_END_TARGET).toMillis());
        boolean ended = !now.isBefore(FY_END_TARGET);

        return new CountdownResponse(
                "FY 2025-2026 Finale",
                ended
                        ? "The 2025-2026 financial year closed at 2026-04-01 00:00:00 Asia/Kolkata."
                        : "Counting down to 2026-04-01 00:00:00 Asia/Kolkata.",
                FY_END_TARGET.toString(),
                INDIA_ZONE.toString(),
                now.toString(),
                millisecondsRemaining,
                ended,
                List.of(
                        "One last sprint before midnight.",
                        "Close the books. Raise the energy.",
                        "FY 2025-2026 deserves a proper sendoff.",
                        "Twelve o'clock turns the page to a new year."
                )
        );
    }
}

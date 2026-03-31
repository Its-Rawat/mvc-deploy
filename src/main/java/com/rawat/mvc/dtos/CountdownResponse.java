package com.rawat.mvc.dtos;

import java.util.List;

public record CountdownResponse(
        String title,
        String subtitle,
        String targetDateTime,
        String timezone,
        String serverDateTime,
        long millisecondsRemaining,
        boolean ended,
        List<String> cheers
) {
}

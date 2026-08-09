package com.safecircle.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safecircle.backend.dto.AddressResponse;
import com.safecircle.backend.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OpenStreetMapServiceImpl implements OpenStreetMapsService {

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;

    @Value("${osm.nominatim-url}")
    private String nominatimUrl;

    @Value("${osm.routing-url}")
    private String routingUrl;

    /**
     * Reverse Geocoding
     */
    @Override
    public AddressResponse reverseGeocode(
            Double latitude,
            Double longitude) {

        try {

            String url =
                    nominatimUrl
                            + "/reverse?format=jsonv2"
                            + "&lat=" + latitude
                            + "&lon=" + longitude;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "SafeCircle/1.0");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            JsonNode json =
                    objectMapper.readTree(response.getBody());

            return AddressResponse.builder()
                    .displayName(
                            json.path("display_name").asText("")
                    )
                    .latitude(latitude)
                    .longitude(longitude)
                    .build();

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Unable to fetch address from OpenStreetMap.",
                    ex
            );
        }
    }

    /**
     * Route API
     */
    @Override
    public RouteResponse getRoute(
            Double startLatitude,
            Double startLongitude,
            Double endLatitude,
            Double endLongitude) {

        try {

            String url =
                    routingUrl
                            + "/route/v1/driving/"
                            + startLongitude + ","
                            + startLatitude + ";"
                            + endLongitude + ","
                            + endLatitude
                            + "?overview=full"
                            + "&geometries=geojson";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "SafeCircle/1.0");

            HttpEntity<String> entity =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            JsonNode root =
                    objectMapper.readTree(response.getBody());

            JsonNode route =
                    root.path("routes").get(0);

            return RouteResponse.builder()

                    .distance(
                            route.path("distance").asDouble()
                    )

                    .duration(
                            route.path("duration").asDouble()
                    )

                    .geometry(
                            route.path("geometry").toString()
                    )

                    .status("SUCCESS")

                    .build();

        } catch (Exception ex) {

            return RouteResponse.builder()

                    .status("FAILED")

                    .distance(0.0)

                    .duration(0.0)

                    .geometry(null)

                    .build();
        }
    }

}
CONFIDENCE_THRESHOLD = 0.50

DEFECT_HEALTH_IMPACT = {
    "pothole": 30,
    "waterlogging": 25,
    "crack": 10,
}


def calculate_road_health(defect_count):
    """
    Calculate an initial road health score.

    More defects result in a lower health score.
    """

    score = 100 - (defect_count * 10)

    # Keep score between 0 and 100
    score = max(0, min(100, score))

    return score


def filter_reliable_detections(detections):
    """Split AI predictions into accepted and low-confidence detections."""
    accepted = []
    ignored = []

    for detection in detections:
        confidence = detection.get("confidence")

        if isinstance(confidence, (int, float)) and confidence >= CONFIDENCE_THRESHOLD:
            accepted.append(detection)
        else:
            ignored.append(detection)

    return accepted, ignored


def calculate_inspection_health(detections):
    """Calculate health from accepted AI defects and their severity."""
    health_impact = 0

    for detection in detections:
        damage_type = str(detection.get("damage_type", "")).lower()
        health_impact += DEFECT_HEALTH_IMPACT.get(damage_type, 5)

    return max(0, 100 - health_impact)


def determine_risk_level(score):

    if score <= 30:
        return "CRITICAL"

    elif score <= 50:
        return "HIGH"

    elif score <= 70:
        return "MODERATE"

    else:
        return "LOW"


def determine_maintenance_priority(score):

    if score <= 30:
        return "CRITICAL"

    elif score <= 50:
        return "HIGH"

    elif score <= 70:
        return "MEDIUM"

    else:
        return "LOW"


def get_recommended_action(score):

    if score <= 30:
        return "Immediate inspection and urgent repair"

    elif score <= 50:
        return "Priority maintenance required"

    elif score <= 70:
        return "Schedule maintenance and monitor"

    else:
        return "Routine monitoring"

def calculate_road_health(defect_count):
    """
    Calculate an initial road health score.

    More defects result in a lower health score.
    """

    score = 100 - (defect_count * 10)

    # Keep score between 0 and 100
    score = max(0, min(100, score))

    return score


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
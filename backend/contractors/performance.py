def calculate_performance_score(
    total_projects,
    completed_projects,
    delayed_projects,
    repeat_defects,
    average_repair_time
):

    # Avoid division by zero
    if total_projects == 0:
        return 0

    # 1. Completion rate
    completion_rate = (
        completed_projects / total_projects
    ) * 100

    # 2. On-time completion
    on_time_projects = completed_projects - delayed_projects

    if completed_projects > 0:
        on_time_rate = (
            on_time_projects / completed_projects
        ) * 100
    else:
        on_time_rate = 0

    # 3. Repeat defect score
    repeat_defect_score = max(
        0,
        100 - (repeat_defects * 10)
    )

    # 4. Repair time score
    repair_time_score = max(
        0,
        100 - (float(average_repair_time) * 5)
    )

    # Final weighted score
    score = (
        completion_rate * 0.30
        + on_time_rate * 0.30
        + repeat_defect_score * 0.25
        + repair_time_score * 0.15
    )

    return round(score)
from .models import Contractor
from .accountability import get_contractor_accountability


def update_contractor_performance(contractor_id):

    contractor = Contractor.objects.get(
        id=contractor_id
    )

    accountability = get_contractor_accountability(
        contractor_id
    )

    total_repairs = accountability["total_repairs"]
    completed_repairs = accountability["completed_repairs"]
    delayed_repairs = accountability["delayed_repairs"]
    repeat_defects = accountability["repeat_defects"]

    # Use maintenance records when available.
    # Otherwise keep the contractor's existing project data.
    if total_repairs > 0:

        total_projects = total_repairs
        completed_projects = completed_repairs
        delayed_projects = delayed_repairs

    else:

        total_projects = contractor.total_projects
        completed_projects = contractor.completed_projects
        delayed_projects = contractor.delayed_projects

    score = calculate_score(
        total_projects,
        completed_projects,
        delayed_projects,
        repeat_defects,
        contractor.average_repair_time
    )

    contractor.performance_score = score

    contractor.save(
        update_fields=[
            "performance_score",
            "updated_at"
        ]
    )

    return score


def calculate_score(
    total_projects,
    completed_projects,
    delayed_projects,
    repeat_defects,
    average_repair_time
):

    if total_projects == 0:
        return 0

    completion_rate = (
        completed_projects / total_projects
    ) * 100

    if completed_projects > 0:
        on_time_projects = (
            completed_projects - delayed_projects
        )

        on_time_rate = (
            on_time_projects / completed_projects
        ) * 100
    else:
        on_time_rate = 0

    repeat_defect_score = max(
        0,
        100 - (repeat_defects * 10)
    )

    repair_time_score = max(
        0,
        100 - (float(average_repair_time) * 5)
    )

    score = (
        completion_rate * 0.30
        + on_time_rate * 0.30
        + repeat_defect_score * 0.25
        + repair_time_score * 0.15
    )

    return round(score)
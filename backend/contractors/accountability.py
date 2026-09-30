from maintenance.models import Maintenance


def get_contractor_accountability(contractor_id):

    records = Maintenance.objects.filter(
        contractor_id=contractor_id
    )

    total_repairs = records.count()

    completed_repairs = records.filter(
        status="COMPLETED"
    ).count()

    delayed_repairs = records.filter(
        is_delayed=True
    ).count()

    repeat_defects = records.filter(
        repeat_defect=True
    ).count()

    return {
        "total_repairs": total_repairs,
        "completed_repairs": completed_repairs,
        "delayed_repairs": delayed_repairs,
        "repeat_defects": repeat_defects,
    }
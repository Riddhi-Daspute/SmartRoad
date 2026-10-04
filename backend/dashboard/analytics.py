from maintenance.models import Maintenance
from contractors.models import Contractor
from .models import RoadHealth


def get_dashboard_summary():

    total_roads = RoadHealth.objects.count()

    total_maintenance = Maintenance.objects.count()

    pending_maintenance = Maintenance.objects.filter(
        status="PENDING"
    ).count()

    completed_maintenance = Maintenance.objects.filter(
        status="COMPLETED"
    ).count()

    delayed_repairs = Maintenance.objects.filter(
        is_delayed=True
    ).count()

    critical_roads = RoadHealth.objects.filter(
        risk_level="CRITICAL"
    ).count()

    high_risk_roads = RoadHealth.objects.filter(
        risk_level="HIGH"
    ).count()

    total_contractors = Contractor.objects.count()

    contractors = Contractor.objects.all()

    if contractors.exists():
        average_contractor_score = round(
            sum(
                contractor.performance_score
                for contractor in contractors
            ) / contractors.count()
        )
    else:
        average_contractor_score = 0

    return {
        "total_roads": total_roads,
        "total_maintenance": total_maintenance,
        "pending_maintenance": pending_maintenance,
        "completed_maintenance": completed_maintenance,
        "delayed_repairs": delayed_repairs,
        "critical_roads": critical_roads,
        "high_risk_roads": high_risk_roads,
        "total_contractors": total_contractors,
        "average_contractor_score": average_contractor_score,
    }
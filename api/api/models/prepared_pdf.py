from django.db import models


class PreparedPdf(models.Model):
    id = models.AutoField(
        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
    )
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    # stored encrypted when key_id is set
    data = models.BinaryField(blank=True, null=True)
    json_data = models.BinaryField(blank=True, null=True)

    # encryption key identifier
    key_id = models.CharField(max_length=32, blank=True, null=True)
    pdf_type = models.CharField(max_length=32, blank=True, null=True)
    version = models.CharField(max_length=32, blank=True, null=True)
    application = models.ForeignKey(
        "Application",
        related_name="prepared_pdf_application_id",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["application_id", "pdf_type"],
                name="unique_pdf_type_application_id",
            ),
        ]

-- =========================================================================
-- ====================== PROCEDIMIENTOS ALMACENADOS =======================
-- =========================================================================
--REPORTE PARA PROYECTOS

DELIMITER //
DROP PROCEDURE IF EXISTS sp_report_proy_area //
CREATE PROCEDURE sp_report_proy_area ( IN x_fecha VARCHAR(4), IN x_area_tem BIGINT)
BEGIN
	SELECT  PATE.cArea_tematica AS AREA,
			BPA.apellPate_participante AS APELLIDO_PATERNO,
			BPA.apellMate_participante AS APELLIDO_MATERNO,
			BPA.nom_participante AS NOMBRE,
			PPR.fechaInicio AS FECHA_INICIO,
			PPR.fechaFin AS FECHA_FIN,
			PPR.nomProyecto AS NOMBRE_PROYECTO,
			PPA.cpais AS PAIS,
			PIFI.cInstFinancia AS FUENTE_FINANCIAMIENTO,
			BDEV.Cod_autorizacion AS AUTORIZACION
            
	FROM   becarios_participante BPA
	JOIN   becarios_det_eventoproyecto BDEV
		   ON BDEV.participante_id = BPA.id
	JOIN   proyectos_proyecto PPR
		   ON BDEV.proyecto_id = PPR.id
	JOIN   proyectos_pais PPA
		   ON PPR.cpais_id = PPA.id
	JOIN   proyectos_institucion_financiamiento PIFI
		   ON PPR.cInstFinanc_id = PIFI.id
	JOIN   proyectos_area_tematica PATE
		   ON PPR.cAreaTem_id = PATE.id
           
	WHERE  YEAR(PPR.fechaInicio) = x_fecha
		   AND BPA.estado = 1
		   AND PATE.id = x_area_tem
	ORDER BY PATE.cArea_tematica;
END //
DELIMITER ;

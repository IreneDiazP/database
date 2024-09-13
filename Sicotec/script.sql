-- =========================================================================
-- ====================== PROCEDIMIENTOS ALMACENADOS =======================
-- =========================================================================
--REPORTE PARA PROYECTOS

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_report_proy_area $$
CREATE PROCEDURE sp_report_proy_area (
    IN x_area_tem INT,
    IN x_fecha INT
)
BEGIN

    SET @sql = 'SELECT 
					PAT.cArea_tematica AS AREA,
					BP.id AS id_PARTICIPANTE,
					BP.apellPate_participante AS APELLIDO_PATERNO,
					BP.apellMate_participante AS APELLIDO_MATERNO,
					BP.nom_participante AS NOMBRE,
					PP.fechaInicio AS FECHA_INICIO,
					PP.fechaFin AS FECHA_FIN,
					PP.nomProyecto AS NOMBRE_PROYECTO,
					PAIS.cpais AS PAIS,
					PIFI.cInstFinancia AS FUENTE_FINANCIAMIENTO, 
					BEP.Cod_autorizacion AS AUTORIZACION

				FROM proyectos_area_tematica PAT
				JOIN proyectos_proyecto PP
					ON PAT.id = PP.cAreaTem_id
				JOIN becarios_det_eventoproyecto BEP
					ON BEP.proyecto_id = PP.id
				JOIN becarios_participante BP
					ON BP.id = BEP.participante_id
				JOIN proyectos_pais PAIS
					ON PP.cpais_id = PAIS.id
				LEFT JOIN proyectos_institucion_financiamiento PIFI
					ON PP.cInstFinanc_id = PIFI.id 
                WHERE BP.estado = 1'; 

    
    IF x_area_tem IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND PAT.id = ', x_area_tem);
    END IF;

    IF x_fecha IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND YEAR(PP.fechaInicio) = ', x_fecha);
    END IF;

	SET @sql = CONCAT(@sql, ' ORDER BY PP.fechaInicio ASC');

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END $$
DELIMITER ;


------------ REPORTE PARA EVENTOS ---------------------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_report_event_area $$
CREATE PROCEDURE sp_report_event_area (
    IN x_area_tem INT,
    IN x_fecha INT
)
BEGIN
    -- Construir la consulta base
    SET @sql = 'SELECT 
					PAT.cArea_tematica AS AREA,
                    BP.id AS id_PARTICIPANTE,
                    BP.nom_participante AS NOMBRE, 
                    BP.apellPate_participante AS APELLIDO_PATERNO,
					BP.apellMate_participante AS APELLIDO_MATERNO,
                    EE.fechaInicio AS FECHA_INICIO,
                    EE.fechaFin AS FECHA_FIN,
                    EE.nomEvento AS NOMBRE_EVENTO,
                    PAIS.cpais AS PAIS,
                    PIFI.cInstFinancia AS FUENTE_FINANCIAMIENTO, 
					BEP.Cod_autorizacion AS AUTORIZACION

				FROM proyectos_area_tematica PAT
				JOIN eventos_evento EE
					ON PAT.id = EE.cAreaTem_id
				JOIN becarios_det_eventoproyecto BEP
					ON BEP.evento_id = EE.id
				JOIN becarios_participante BP
					ON BP.id = BEP.participante_id
				JOIN proyectos_pais PAIS
					ON EE.cpais_id = PAIS.id
				LEFT JOIN proyectos_institucion_financiamiento PIFI
					ON EE.cInstFinanc_id = PIFI.id 
                WHERE BP.estado = 1'; 

    
    IF x_area_tem IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND PAT.id = ', x_area_tem);
    END IF;

    IF x_fecha IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND YEAR(EE.fechaInicio) = ', x_fecha);
    END IF;

	SET @sql = CONCAT(@sql, ' ORDER BY EE.fechaInicio ASC');

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END $$
DELIMITER ;
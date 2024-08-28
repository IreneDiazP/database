-- =========================================================================
-- ====================== PROCEDIMIENTOS ALMACENADOS =======================
-- =========================================================================
--ACTUALIZAR  LA TABLA MAESTRA DETALLE PLAN MEDICION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_actualizarMaestroDetallePlanMedicion`(
    IN idPlanMedicion INT,
    IN idUser INT,
    IN fechaActual DATETIME(6)
)
BEGIN
    DECLARE estado INT;

    SELECT lestado INTO estado
    FROM plan_medicion_planmedicion
    WHERE id = idPlanMedicion;


    IF estado = 0 THEN


        UPDATE plan_medicion_planmedicion
        SET lestado = 1,
            updated_by_id = idUser,
            updated = fechaActual
        WHERE id = idPlanMedicion;


        UPDATE plan_medicion_detalleplanmedicion
        SET lestado = 1,
            updated_by_id = idUser,
            updated = fechaActual
        WHERE plnMedicion_id = idPlanMedicion;

            INSERT INTO plan_medicion_detalleplanmedicion
        (plnMedicion_id, curso_id, docente_id, created_by_id, lestEvaluacion, lestado, created, updated)
        SELECT
            DISTINCT PM.id, CU.id, UP.id, idUser, 0, 1, fechaActual, fechaActual
        FROM plan_medicion_planmedicion PM
        JOIN gestion_curso_cursocompetencia GCC
            ON PM.competen_id = GCC.competen_id
        JOIN plan_estudio_curso CU
            ON CU.id = GCC.curso_id
        JOIN gestion_curso_cursodocente GCD
            ON GCD.curso_id = CU.id
        JOIN perfil_userprofile UP
            ON UP.id = GCD.docente_id
            AND UP.perfil_id = 3
        JOIN auth_user AUS
            ON AUS.id = UP.usuario_id
        WHERE PM.id = idPlanMedicion
        AND GCD.lestado = 1
        AND GCC.lestado = 1;



    ELSE


        UPDATE plan_medicion_planmedicion
        SET lestado = 0,
            updated_by_id = idUser,
            updated = fechaActual
        WHERE id = idPlanMedicion;


        UPDATE plan_medicion_detalleplanmedicion
        SET lestado = 0,
            updated_by_id = idUser,
            updated = fechaActual
        WHERE plnMedicion_id = idPlanMedicion;

    END IF;

END



--OBTENER ID DEL DOCENTE MEDIANTE EL ID CURSOS Y ID PLAN MEDICION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_IDcursoDocente`(
    IN idPlanMedicion INT,
    IN id_curso INT
)
BEGIN
        SELECT UP.id AS id_docente
    FROM plan_medicion_planmedicion PM
    JOIN gestion_curso_cursocompetencia GCC
        ON PM.competen_id = GCC.competen_id
    JOIN plan_estudio_curso CU
        ON CU.id = GCC.curso_id
    JOIN gestion_curso_cursodocente GCD
        ON GCD.curso_id = CU.id
    JOIN perfil_userprofile UP
        ON UP.id = GCD.docente_id
        AND UP.perfil_id = 3
    JOIN auth_user AUS
        ON AUS.id = UP.usuario_id
    WHERE PM.id = idPlanMedicion
AND GCD.lestado = 1
    AND GCC.lestado = 1
    AND CU.id = id_curso;

END



--INSERTAR DETALLE RUBRICA

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_insertDetallesRubrica`(
    IN last_id_rubrica INT,
    IN idUser INT,
    IN fechaActual DATETIME(6)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE criterio INT;


DECLARE cursor_detalles_rubrica CURSOR FOR
        SELECT DISTINCT CR.id
        FROM evaluacion_rubrica EV
        JOIN plan_medicion_detalleplanmedicion DPM ON EV.plnMedicionDetall_id = DPM.id
        JOIN plan_medicion_planmedicion PM ON PM.id = DPM.plnMedicion_id
        JOIN metricas_competencia CO ON CO.id = PM.competen_id
        JOIN metricas_criterio CR ON CR.competen_id = CO.id
        WHERE EV.id = last_id_rubrica;


DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cursor_detalles_rubrica;

    read_subdetalles_loop: LOOP
        FETCH cursor_detalles_rubrica INTO criterio;
        IF done THEN
            LEAVE read_subdetalles_loop;
        END IF;


INSERT INTO evaluacion_detallerubrica
        (rubrica_id, criterio_id, created_by_id, created, updated, lestado)
        VALUES (last_id_rubrica, criterio, idUser, fechaActual, fechaActual, 0 );
    END LOOP;

    CLOSE cursor_detalles_rubrica;
END



--INSERTAR MAESTRO DETALLE PLAN MEDICION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_insertMaestroDetallePlanMedicion`(
    IN idPeriodo INT,
    IN idCompetencia INT,
    IN idPrograAcademi INT,
    IN idUser INT,
    IN fechaActual DATETIME(6)
)
BEGIN
    DECLARE idPlanMedicion INT;

    INSERT INTO plan_medicion_planmedicion
    (periodo_id, competen_id, progaAcademi_id, created_by_id, lestadoPlanMedicion, lestado, created, updated )
    VALUES (idPeriodo, idCompetencia, idPrograAcademi, idUser, 0, 1, fechaActual, fechaActual);
    SET idPlanMedicion = LAST_INSERT_ID();


    INSERT INTO plan_medicion_detalleplanmedicion
    (plnMedicion_id, curso_id, docente_id, created_by_id, lestEvaluacion, lestado, created, updated)
    SELECT
        DISTINCT PM.id, CU.id, UP.id, idUser, 0, 1, fechaActual, fechaActual
    FROM plan_medicion_planmedicion PM
    JOIN gestion_curso_cursocompetencia GCC
        ON PM.competen_id = GCC.competen_id
    JOIN plan_estudio_curso CU
        ON CU.id = GCC.curso_id
    JOIN gestion_curso_cursodocente GCD
        ON GCD.curso_id = CU.id
    JOIN perfil_userprofile UP
        ON UP.id = GCD.docente_id
        AND UP.perfil_id = 3
    JOIN auth_user AUS
        ON AUS.id = UP.usuario_id
    WHERE PM.id = idPlanMedicion
    AND GCD.lestado = 1
    AND GCC.lestado = 1;

    SELECT id,plnMedicion_id  FROM plan_medicion_detalleplanmedicion WHERE plnMedicion_id=idPlanMedicion;
END


--INSERTAR MAESTRO RUBRICA

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_insertMaestroRubrica`(
    IN idDetallePlan INT,
    IN idUser INT,
    IN fechaActual DATETIME(6)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE plnDetalle INT;
    DECLARE estudiante INT;
    DECLARE criterio INT;
    DECLARE last_id_rubrica INT;

    DECLARE cursor_rubrica CURSOR FOR
        SELECT DISTINCT DPM.id, ES.id
        FROM plan_medicion_detalleplanmedicion DPM
        JOIN plan_estudio_curso CU
            ON CU.id = DPM.curso_id
        JOIN gestion_curso_cursodocente GCD
            ON DPM.curso_id = GCD.curso_id
            AND DPM.docente_id = GCD.docente_id
        JOIN gestion_curso_estudiantedocente GED
            ON GED.cursoDocente_id = GCD.id
        JOIN estudiante_estudiante ES
            ON ES.id = GED.estudiante_id
        JOIN plan_medicion_planmedicion PM
            ON PM.id = DPM.plnMedicion_id
        JOIN metricas_competencia CO
            ON CO.id = PM.competen_id
        JOIN perfil_userprofile D
            ON D.id = DPM.docente_id
        JOIN auth_user U
            ON U.id = D.usuario_id
        WHERE DPM.id = idDetallePlan
        AND GED.lestado = 1;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cursor_rubrica;

    read_detalles_loop: LOOP
        FETCH cursor_rubrica INTO plnDetalle, estudiante;

        IF done THEN
            LEAVE read_detalles_loop;
        END IF;

        IF (SELECT COUNT(*) FROM evaluacion_rubrica WHERE plnMedicionDetall_id = plnDetalle AND estudiante_id = estudiante) = 0 THEN
            INSERT INTO evaluacion_rubrica
                (plnMedicionDetall_id, estudiante_id, created_by_id, created, updated, lestadoRubrica, lestado, nPromedio)
                VALUES (plnDetalle, estudiante, idUser, fechaActual, fechaActual, 0, 1, 0 );

            SET last_id_rubrica = LAST_INSERT_ID();

            CALL SP_insertDetallesRubrica(last_id_rubrica, idUser, fechaActual);

        END IF;
    END LOOP;

    CLOSE cursor_rubrica;

END


--LISTAR  COMPETENCIA CURSO

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCompetCurso`(IN idCompetencia INT, IN idPeriodo INT, IN idPlanEstu INT)
BEGIN
  SELECT
        PEC.id,
        PEC.created_by_id,
        PEC.periodo_id,
        PEC.competen_id,
        PEC.curso_id,
        PEC.lestado,
        CU.cCodCurso,
        CU.cDesCurso,
        CU.plnEstudio_id
    FROM gestion_curso_cursocompetencia PEC
    JOIN metricas_competencia MC
        ON PEC.competen_id = MC.id
    JOIN plan_estudio_curso CU
        ON CU.id = PEC.curso_id
    WHERE MC.id=idCompetencia && PEC.periodo_id=idPeriodo  && CU.plnEstudio_id=idPlanEstu;
END


--LISTAR COMPETENCIAS HABILES PARA LA EVALUACION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCompetenciasHabilesParaEval`(IN idPeriodo INT, IN idPrograAcademi INT, IN idModelAcredit INT)
BEGIN
    SELECT
        DISTINCT CO.id AS 'COMPETENCIA_ID'
    FROM metricas_competencia CO
    JOIN gestion_curso_cursocompetencia GCC
        ON  CO.id= GCC.competen_id
    JOIN metricas_modelacredit MA
        ON MA.id = CO.modelAcredit_id
    JOIN plan_estudio_curso CU
        ON CU.id = GCC.curso_id
    JOIN plan_estudio_planestudio  PE
        ON PE.id = CU.plnEstudio_id
    JOIN universidad_prograestudio PA
        ON PA.id = PE.progaAcademi_id
    WHERE GCC.periodo_id = idPeriodo
    AND PA.id = idPrograAcademi
    AND MA.id = idModelAcredit;

END


--LISTAR CRITERIOS PARA LA EVALUACION 

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCriteriosDentroDeEvaluacion`(
    IN x_idCompet INT
)
BEGIN
    SELECT B.id, B.cDesCriterio
    FROM evaluacion_detallerubrica A
    JOIN metricas_criterio B
        ON A.criterio_id = B.id
    JOIN metricas_competencia C
        ON B.competen_id = C.id
    WHERE C.id = x_idCompet
    GROUP BY B.id;
END


-- LISTAR CURSO DOCENTE

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCursosDocente`(IN idPlanEstu INT, IN idSemestre INT, IN idPeriodo INT)
BEGIN
    SELECT CD.id, CD.created_by_id ,C.id, C.cCodCurso, C.cDesCurso, D.id, U.first_name, U.last_name, CD.lestado
    FROM plan_estudio_curso C
    JOIN gestion_curso_cursodocente CD
        ON C.id = CD.curso_id
    JOIN perfil_userprofile D
        ON D.id = CD.docente_id
    JOIN auth_user U
        ON U.id = D.usuario_id
    WHERE C.plnEstudio_id = idPlanEstu
    AND C.semestre_id = idSemestre
    AND CD.periodo_id = idPeriodo;

END


--LISTAR LOS CURSOS POR CADA PLAN DE ESTUDIOS

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCursosPorPlanEstud`(IN idPlanEstu INT)
BEGIN
    SELECT id, cCodCurso, cDesCurso
    FROM plan_estudio_curso
    WHERE plnEstudio_id = idPlanEstu;
END


--LISTAR CURSOS POR  CADA SEMESTRE 

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listCursosPorSemestre`(IN idPlanEstu INT, idSemestre INT)
BEGIN
    SELECT id, cCodCurso, cDesCurso
    FROM plan_estudio_curso
    WHERE plnEstudio_id = idPlanEstu
    AND semestre_id = idSemestre;
END


--LISTAR DOCENTES POR CADA SEMESTRE

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listDocentesPorCursos`(IN idPeriodo INT, IN idPlanEstu INT, IN idSemestre INT, IN idCurso INT)
BEGIN
    SELECT CD.id, CD.created_by_id, CD.lestado, D.id, U.first_name, U.last_name
    FROM plan_estudio_curso C
    JOIN gestion_curso_cursodocente CD
        ON C.id = CD.curso_id
    JOIN perfil_userprofile D
        ON D.id = CD.docente_id
    JOIN auth_user U
        ON U.id = D.usuario_id
    WHERE C.plnEstudio_id = idPlanEstu
    AND C.semestre_id = idSemestre
    AND CD.periodo_id = idPeriodo
    AND C.id = idCurso;
END



--LISTAR ESTUDIANTES POR CADA UNIVERSIDAD

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listEstudiantesPorUniversidad`(IN idUniversidad INT)
BEGIN
    SELECT
        id,
        cCodEstudi,
        cNomCompleto,
        lestado
    FROM estudiante_estudiante
    WHERE univer_id = idUniversidad;
END


-- LISTAR ESTUDIANTES ASIGNADOS POR CADA DOCENTE Y EL CURSO

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listEstudiAsignadosPorDocenteCurso`(
    IN idRegistroCursoDoc INT,
    IN idCurso INT
)
BEGIN
    SELECT
        E.id AS 'Estudiante_id',
        E.cCodEstudi AS 'Codigo de Estudiante',
        E.cNomCompleto AS 'Estudiante',
        CD.id AS 'cursodocente_id',
        ED.id AS 'matricula_id',
        ED.lestado AS 'Estado'
    FROM estudiante_estudiante E
    JOIN gestion_curso_estudiantedocente ED
        ON E.id = ED.estudiante_id
    JOIN gestion_curso_cursodocente CD
        ON ED.cursoDocente_id = CD.id
    WHERE CD.id = idRegistroCursoDoc
    AND CD.curso_id = idCurso;
END


--LISTAR ESTUDIANTES MATRICULADOS POR CADA CURSO

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listEstudiMatriculadosPorCurso`(
    IN idCurso INT
)
BEGIN
    SELECT
        E.id,
        E.cCodEstudi AS 'Codigo de Estudiante',
        E.cNomCompleto,
        CD.id AS 'docenteCurso_id',
        ED.id AS 'matricula_id',
        ED.lestado
    FROM estudiante_estudiante E
    JOIN gestion_curso_estudiantedocente ED
        ON E.id = ED.estudiante_id
    JOIN gestion_curso_cursodocente CD
        ON ED.cursoDocente_id = CD.id
    WHERE CD.curso_id = idCurso
    AND ED.lestado = 1;
END


--LISTAR EVALUACIONES POR CURSO Y COMPETENCIA

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listEvaluacionesPorCursoCompet`(
    IN x_idCurso INT,
    IN x_idCompet INT,
    IN x_idUser INT,
    IN x_idEstudiante INT
)
BEGIN

    SELECT
        CR.id AS 'ID DE CRITERIOS',
        CR.cDesCriterio AS 'DESC CRITERIO',
        DRUB.nPuntaje AS 'PUNTAJE',
        RUB.id AS 'ID RUBRICA'
    FROM evaluacion_detallerubrica DRUB
    INNER JOIN metricas_criterio CR
        ON DRUB.criterio_id = CR.id
    INNER JOIN evaluacion_rubrica RUB
        ON DRUB.rubrica_id = RUB.id
    INNER JOIN plan_medicion_detalleplanmedicion DPM
        ON RUB.plnMedicionDetall_id = DPM.id
    INNER JOIN plan_medicion_planmedicion PM
        ON DPM.plnMedicion_id = PM.id
    INNER JOIN plan_estudio_curso CU
        ON CU.id = DPM.curso_id
    INNER JOIN metricas_competencia CO
        ON CO.id = CR.competen_id
    INNER JOIN estudiante_estudiante ES
        ON ES.id = RUB.estudiante_id
    JOIN perfil_userprofile P
        ON P.id = DPM.docente_id
    JOIN auth_user U
        ON U.id = P.usuario_id
    WHERE DPM.curso_id = x_idCurso
    AND ES.id = x_idEstudiante
    AND CO.id = x_idCompet
    AND U.id = x_idUser
    AND DPM.lestado = 1;

END


--LISTAR EVALUACIONES POR DOCENTE

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listEvaluacionesPorDocente`(IN idPeriodo INT, IN idUser INT)
BEGIN
    SELECT DISTINCT
        CO.cCodCompet ,
        CC.curso_id ,
        CU.cDesCurso ,
        PA.cNomProgEstudi ,
        SM.numero ,
        PM.id ,
        PM.lestadoPlanMedicion ,
        PM.lestado
    FROM plan_medicion_planmedicion PM
    JOIN metricas_competencia CO
        ON PM.competen_id = CO.id
    JOIN gestion_curso_cursocompetencia CC
        ON CO.id = CC.competen_id
    JOIN gestion_curso_cursodocente CD
        ON CC.curso_id = CD.curso_id
    JOIN plan_estudio_curso CU
        ON CU.id = CC.curso_id
    JOIN plan_medicion_detalleplanmedicion DPM
        ON DPM.curso_id = CU.id
    JOIN plan_estudio_semestre SM
        ON SM.id = CU.semestre_id
    JOIN plan_estudio_planestudio PE
        ON PE.id = CU.plnEstudio_id
    JOIN universidad_prograestudio PA
        ON PA.id = PE.progaAcademi_id
    JOIN perfil_userprofile D
        ON D.id = CD.docente_id
    JOIN auth_user U
        ON U.id = D.usuario_id
    WHERE PM.periodo_id = idPeriodo
    AND U.id = idUser
    AND PM.lestado = 1
    AND CD.lestado = 1
    AND CC.lestado = 1;
END


--LISTAR EL PLAN DE MEDICION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listPlanMedicion`(IN idPeriodo INT, IN IdUniversidad INT)
BEGIN
    SELECT DISTINCT
        PA.cNomProgEstudi,
        CO.cCodCompet,
        CC.curso_id,
        CU.cDesCurso,
        CD.docente_id,
        U.first_name,
        U.last_name,
        PM.lestadoPlanMedicion,
        PM.lestado
    FROM plan_medicion_planmedicion PM
    JOIN metricas_competencia CO
        ON PM.competen_id = CO.id
    JOIN gestion_curso_cursocompetencia CC
        ON CO.id = CC.competen_id
    JOIN gestion_curso_cursodocente CD
        ON CC.curso_id = CD.curso_id
    JOIN plan_estudio_curso CU
        ON CU.id = CC.curso_id
    JOIN plan_medicion_detalleplanmedicion DPM
        ON DPM.curso_id = CU.id
    JOIN plan_estudio_planestudio PE
        ON PE.id = CU.plnEstudio_id
    JOIN universidad_prograestudio PA
        ON PA.id = PE.progaAcademi_id
    JOIN perfil_userprofile D
        ON D.id = CD.docente_id
    JOIN auth_user U
        ON U.id = D.usuario_id
    WHERE PM.periodo_id = idPeriodo
    AND PA.univer_id =IdUniversidad
    AND PM.lestado = 1
    AND CD.lestado = 1
    AND CC.lestado = 1;
END


--OBTENER OTENEMOS EL ID DEL PLAN DE MEDICION

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listPlanMedicionId`(IN x_idcurso INT, IN x_planestudio_id INT)
BEGIN
    SELECT PLMT.id AS id_planMedicionDetalle
    FROM plan_medicion_detalleplanmedicion PLMT
    JOIN plan_medicion_planmedicion PM
        ON PLMT.plnMedicion_id = PM.id
    JOIN metricas_competencia MC
        ON PM.competen_id = MC.id
    JOIN universidad_prograestudio UPE
        ON PM.progaAcademi_id=UPE.id
    JOIN  gestion_curso_cursocompetencia GCC
        ON GCC.competen_id=MC.id
    JOIN plan_estudio_curso PEC
        ON PEC.id=GCC.curso_id
    WHERE PEC.id= x_idcurso
    AND UPE.id=x_planestudio_id;

END


--LISTAR PLAN MEDICION POR MODELO ACREDITADO

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listPlanMedicionPorModelAcredit`(IN idPeriodo INT, IN idPrograAcademi INT, IN idModelAcredit INT)
BEGIN
    SELECT
        CO.id AS 'ID DE COMPETENCIA',
        CO.cCodCompet AS 'COMPETENCIA',
        MA.id AS 'ID DE MODELO DE ACREDITACION',
        MA.cModelAcredit AS 'MODELO DE ACREDITACION',
        PM.id AS 'ID PLAN DE MEDICION',
        PM.lestado AS 'ESTADO'
    FROM plan_medicion_planmedicion PM
    JOIN metricas_competencia CO
        ON PM.competen_id = CO.id
    JOIN metricas_modelacredit MA
        ON MA.id = CO.modelAcredit_id
    WHERE PM.periodo_id = idPeriodo
    AND PM.progaAcademi_id = idPrograAcademi
    AND MA.id = idModelAcredit;
END


--LISTAR SEMESTRES

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_listSemestres`(IN idPlnEstudio INT)
BEGIN
    SELECT id,numero,
        CASE numero
            WHEN 1 THEN 'Primer semestre'
            WHEN 2 THEN 'Segundo semestre'
            WHEN 3 THEN 'Tercer semestre'
            WHEN 4 THEN 'Cuarto semestre'
            WHEN 5 THEN 'Quinto semestre'
            WHEN 6 THEN 'Sexto semestre'
            WHEN 7 THEN 'Septimo semestre'
            WHEN 8 THEN 'Octavo semestre'
            WHEN 9 THEN 'Noveno semestre'
            WHEN 10 THEN 'Decimo semestre'
            ELSE CONCAT(numero, 'º semestre')
        END AS semestre_texto
    FROM plan_estudio_semestre
    WHERE planEstudio_id = idPlnEstudio;
END


-- VALIDAR ESTUDIANTES MATRICULADOS

CREATE DEFINER=`uassess`@`%` PROCEDURE `SP_validaEstudianteMatriculado`(IN x_idcurso INT, IN x_docente_id INT)
BEGIN
    SELECT GCE.estudiante_id AS id_esstudiantes
    FROM gestion_curso_estudiantedocente GCE
    JOIN gestion_curso_cursodocente GCD
        ON GCE.cursoDocente_id=GCD.id
    JOIN plan_estudio_curso PEC
        ON GCD.curso_id=PEC.id
    JOIN perfil_userprofile PUP
        ON GCD.docente_id=PUP.id
    WHERE GCD.docente_id = x_docente_id
    AND GCD.curso_id = x_idcurso
    AND GCE.lestado = 1;
END
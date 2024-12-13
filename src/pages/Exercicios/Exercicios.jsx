import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import styles from "./Exercicios.module.css";
import fotoBanner from "../../assets/bannerEx.png";
import bg from "../../assets/bg1.jpg";
import Titulo from "../../components/ui/Titulo";
import { useDispatch, useSelector } from "react-redux";
import { exercisesFetchOptions } from "../../services/ExercicesApi";
import useFetch from "../../hooks/useFetch";
import { useEffect, useRef } from "react";
import { setCategorias, setEquipamentos, setExerciciosFiltrados, setFiltros, setMusculoAlvo } from "../../state/exercicios/exerciciosSlice";
import CardExercicio from "../../components/CardExercicio/CardExercicio";
import { Link } from "react-router-dom";

const Exercicios = () => {
   const {
      categorias: partesCorpo,
      equipamentos,
      musculoAlvo,
      exercicios,
      filtros,
      exerciciosFiltrados,
   } = useSelector((state) => state.exercicios);
   const dispatch = useDispatch();
   const parteDoCorpoRef = useRef();
   const equipamentoRef = useRef();
   const musculoAlvoRef = useRef();

   const apanharPartesCorpo = useFetch("https://exercisedb.p.rapidapi.com/exercises/bodyPartList", exercisesFetchOptions, partesCorpo);

   const apanharEquipamentos = useFetch("https://exercisedb.p.rapidapi.com/exercises/equipmentList", exercisesFetchOptions, equipamentos);

   const apanharMusculoAlvo = useFetch("https://exercisedb.p.rapidapi.com/exercises/targetList", exercisesFetchOptions, musculoAlvo);

   useEffect(() => {
      if (!partesCorpo) dispatch(setCategorias(apanharPartesCorpo.data));
      if (!equipamentos) dispatch(setEquipamentos(apanharEquipamentos.data));
      if (!musculoAlvo) dispatch(setMusculoAlvo(apanharMusculoAlvo.data));
   }, [apanharPartesCorpo.data, apanharEquipamentos.data, apanharMusculoAlvo.data]);

   function filtrarExercicios() {
      dispatch(
         setFiltros({
            parteDoCorpo: parteDoCorpoRef.current.value,
            equipamento: equipamentoRef.current.value,
            musculoAlvo: musculoAlvoRef.current.value,
         })
      );

      const dadosFiltrados = exercicios
         ?.filter((parteDoCorpo) =>
            parteDoCorpoRef?.current?.value !== "todos" ? parteDoCorpo?.bodyPart?.includes(parteDoCorpoRef?.current?.value) : true
         )
         ?.filter((equipamento) =>
            equipamentoRef?.current?.value !== "todos" ? equipamento?.equipment?.includes(equipamentoRef?.current?.value) : true
         )
         ?.filter((musculoAlvo) =>
            musculoAlvoRef?.current?.value !== "todos" ? musculoAlvo?.target?.includes(musculoAlvoRef?.current?.value) : true
         );

      dispatch(setExerciciosFiltrados(dadosFiltrados));
   }

   // Caso a página carrege e hajam filtros
   useEffect(() => {
      if (!exerciciosFiltrados && exercicios) filtrarExercicios();
   }, []);

   return (
      <div>
         {/*  Banner inicial */}
         <div
            id={styles.banner}
            className="position-relative overflow-hidden bg-secondary
bg-gradient pt-5  pb-0"
         >
            <Image src={bg} id={styles.bg} className="position-absolute top-0 start-0 end-0 h-auto" />
            <Container>
               <Row className="position-relative">
                  <Col sm={7} className="justify-content-center flex-column gap-3 d-flex">
                     <h2 id={styles.titBanner}>Está na hora de dar aquela melhorada no seu físico</h2>
                     <p className="fs-4">Mais de 1000 exercícios foram preparados para você</p>
                  </Col>
                  <Col className="text-end pe-5">
                     <Image src={fotoBanner} />
                  </Col>
               </Row>
            </Container>
         </div>
         <Container fluid>
            <Row className="py-5">
               <Col className="text-center">
                  <Titulo texto="Encontre todos os exercícios" />
                  {/*  Filtragem  */}
                  <Form className="mb-5 mt-4 px-5 container">
                     <Row className="px-5 g-5">
                        <Col>
                           <Form.Group>
                              <Form.Label className="fs-4 fw-semibold mb-3">Parte do corpo</Form.Label>
                              <Form.Select onChange={filtrarExercicios} ref={parteDoCorpoRef} className="text-capitalize">
                                 <option value="todos">Todos</option>
                                 {partesCorpo?.map((v, k) => (
                                    <option key={k} value={v}>
                                       {v}
                                    </option>
                                 ))}
                              </Form.Select>
                           </Form.Group>
                        </Col>
                        <Col>
                           <Form.Group>
                              <Form.Label className="fs-4 fw-semibold mb-3">Equipamento</Form.Label>
                              <Form.Select onChange={filtrarExercicios} ref={equipamentoRef} className="text-capitalize">
                                 <option value="todos">Todos</option>
                                 {equipamentos?.map((v, k) => (
                                    <option value={v} key={k}>
                                       {v}
                                    </option>
                                 ))}
                              </Form.Select>
                           </Form.Group>
                        </Col>
                        <Col>
                           <Form.Group>
                              <Form.Label className="fs-4 fw-semibold mb-3">Músculo a fortificar</Form.Label>
                              <Form.Select onChange={filtrarExercicios} ref={musculoAlvoRef} className="text-capitalize">
                                 <option value="todos">Todos</option>
                                 {musculoAlvo?.map((v, k) => (
                                    <option value={v} key={k}>
                                       {v}
                                    </option>
                                 ))}
                              </Form.Select>
                           </Form.Group>
                        </Col>
                     </Row>
                  </Form>

                  {/* Exercicios */}
                  <Container fluid className="mt-5 px-5">
                     <hr className="mx-5" />

                     <Row className="mt-2 mb-5 px-5 mx-5 g-4 justify-content-center flex-content-stretch">
                        {exerciciosFiltrados?.map(
                           (v, k) =>
                              k < 12 && (
                                 <Col key={k} xs={3}>
                                    <CardExercicio titulo={v?.name} id={v?.id} foto={v?.gifUrl} categoria={v?.secondaryMuscles} />
                                 </Col>
                              )
                        )}
                     </Row>

                     {/* TODO: Adicionar feat de paginação */}
                  </Container>
               </Col>
            </Row>
         </Container>
      </div>
   );
};
export default Exercicios;

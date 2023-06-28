import { assign, createMachine } from "xstate";
import { fetchCountries } from "../utils/api";

const fillCountries = {
    initial: "loading",
    states: {
      loading: {
        invoke: {
            id: 'getCountries',
            src: () => fetchCountries,
            onDone: {
                target: 'success',
                actions: assign({
                    countries: (context, event) => event.data,
                  })
            },
            onError: {
                target: 'failure',
                actions: assign({
                  error: 'Fallo el request',
                })
            }
        }
      },
      success: {},
      failure: {
        on: {
          RETRY: { target: "loading" },
        },
      },
    },
};

const bookingMachine = createMachine ({
    id: 'book a fly',
    initial: 'initial',
    context: {
        passengers: [],
        selectedCountry: "",
        countries: [],
        error: '',
    },  
    states: {
        initial: {
            on: {
                START: {
                    target:'search',
                    actions: 'printTransition'
                }
            }
            },
        search: {
            entry: 'printEntry',
            exit: 'printExit',
            on: {
                CANCEL: {
                    target: 'initial',
                    actions: 'cleanContext'
                },
                CONTINUE: {
                    target: 'passengers',
                    actions: assign({selectedCountry: (context, event)=> event.selectedCountry})
                }
            },
            ...fillCountries,
        },
        passengers: {
            on: {
                CANCEL: {
                    target: 'initial',
                    actions: 'cleanContext'
                },
                DONE: {
                    target: 'tickets',
                    cond: 'ceroPassengers'
                },
                ADD: {
                    target: 'passengers',
                    actions: assign((context, event)=>context.passengers.push(event.newPassenger))
                }
            }
        },
        tickets: {
            after: {
                5000: {
                  target: 'initial',
                  actions: 'cleanContext',
                }
              },
            on: {
                FINISH: 'initial'
            }
        }
    }
}, {
    actions: {
      printTransition: ()=> console.log('transition'),
      printTransitionTwo: ()=> console.log('transition two'),
      printEntry: ()=> console.log('entry'),
      printExit: ()=> console.log('exit'),
      cleanContext: assign({
        selectedCountry: "",
        passengers: [],
      }),
    },
    guards: {
        ceroPassengers: (context) => {
            return context.passengers.length > 0
        }
    }
}
)

export {bookingMachine}

//ejemplo paralelas
// import { createMachine } from 'xstate';

// const fileMachine = createMachine({
//   id: 'archivos',
//   type: 'parallel',
//   states: {
//     upload: {
//       initial: 'inicial',
//       states: {
//         inicial: {
//           on: {
//             INIT_UPLOAD: { target: 'cargando' }
//           }
//         },
//         cargando: {
//           on: {
//             UPLOAD_COMPLETE: { target: 'terminado' }
//           }
//         },
//         terminado: {}
//       }
//     },
//     download: {
//       initial: 'inicial',
//       states: {
//         inicial: {
//           on: {
//             INIT_DOWNLOAD: { target: 'cargando' }
//           }
//         },
//         cargando: {
//           on: {
//             DOWNLOAD_COMPLETE: { target: 'terminado' }
//           }
//         },
//         terminado: {}
//       }
//     }
//   }
// });
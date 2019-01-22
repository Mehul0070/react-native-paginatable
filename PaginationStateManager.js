import { createActions, createReducer } from 'reduxsauce';
import PaginateService from './PaginateService';

export default class PaginationStateManager {
    constructor(name, url, onParsePaginationResponse = (data) => { return data }, customizedReducerPath = null) {
        this.name = name
        this.endpointUrl = url
        this.onParsePaginationResponse = onParsePaginationResponse
        this.customizedReducerPath = customizedReducerPath

        this.initialState = {
            items: []
        }

        this.actionObject = {
            'loadMore'  : ['newItems'],
            'refresh'   : ['newItems']
        }

        const { Types, Creators } = createActions(this.actionObject, { prefix: `${name.toUpperCase()}_` })

        this.actionTypes = Types
        this.actions = Creators

        this.actionHandlers = {
            [Types['LOAD_MORE']]: (state, { newItems }) => {
                return {
                    ...state,
                    items: state.items.concat(newItems)
                }
            },
            [Types['REFRESH']]: (state, { newItems }) => {
                return {
                    ...state,
                    items: newItems
                }
            }
        }
    }

    reducer = () => {
        return createReducer(this.initialState, this.actionHandlers)
    }

    addAction({ type, payload, handler }) {
        let handlerName = type.split(/(?=[A-Z])/).join('_').toUpperCase();

        this.actionObject[type] = payload
        const { Types, Creators } = createActions(this.actionObject, { prefix: `${this.name.toUpperCase()}_` })
    
        this.actionTypes = Types
        this.actions = Creators

        this.actionHandlers[Types[handlerName]] = handler

        Object.getPrototypeOf(this)[type] = (args) => {
            return (dispatch) => {
                dispatch(this.actions[type].apply(null, Object.values(args)))
            }
        }
    }

    addActions(actionArr) {
        actionArr.map((action) => {
            this.addAction(action)
        })
    }

    loadMore = ({ headers, pageNumberKey, pageSizeKey, pageNumber, pageSize, ...args }, successCallback = () => {}, errorCallback = () => {}) => {
        return (dispatch) => {
            PaginateService.getItems({ headers, pageNumberKey, pageSizeKey, pageNumber, pageSize, endpointUrl: this.endpointUrl, ...args })
            .then(response => {
                if (this.onParsePaginationResponse) {
                    const { items, totalPagesNumber } = this.onParsePaginationResponse(response.data)
                    dispatch(this.actions.loadMore(items || []))
                    successCallback(totalPagesNumber)
                } else {
                    dispatch(this.actions.loadMore(response.data))
                    successCallback()
                }
            })
            .catch(error => {
                if (__DEV__) console.log(JSON.stringify(error))
                errorCallback(error)
            })
        }
    }

    refresh = ({ headers, pageNumberKey, pageSizeKey, pageNumber, pageSize, ...args }, successCallback = () => {}, errorCallback = () => {}) => {
        return (dispatch) => {
            PaginateService.getItems({ headers, pageNumberKey, pageSizeKey, pageNumber, pageSize, endpointUrl: this.endpointUrl, ...args })
            .then(response => {
                if (this.onParsePaginationResponse) {
                    const { items, totalPagesNumber } = this.onParsePaginationResponse(response.data)
                    dispatch(this.actions.refresh(items || []))
                    successCallback(totalPagesNumber)
                } else {
                    dispatch(this.actions.refresh(response.data))
                    successCallback()
                }
            })
            .catch(error => {
                if (__DEV__) console.log(JSON.stringify(error))
                errorCallback(error)
            })
        }
    }

}
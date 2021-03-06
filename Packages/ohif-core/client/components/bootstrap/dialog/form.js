import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

Template.dialogForm.onCreated(() => {
    const instance = Template.instance();

    instance.api = {

        confirm() {
            // Check if the form has valid data
            const form = instance.$('form').data('component');
            if (!form.validate()) {
                return;
            }

            // Hide the modal, removing the backdrop
            instance.$('.modal').on('hidden.bs.modal', event => {
                // Get the form value and call the confirm callback or resolve the promise
                const formData = form.value();
                if (_.isFunction(instance.data.confirmCallback)) {
                    instance.data.confirmCallback(formData, instance.data.promiseResolve);
                } else {
                    instance.data.promiseResolve(formData);
                }
            }).modal('hide');
        },

        cancel() {
            // Hide the modal, removing the backdrop
            instance.$('.modal').on('hidden.bs.modal', event => {
                // Call the cancel callback or resolve the promise
                if (_.isFunction(instance.data.cancelCallback)) {
                    instance.data.cancelCallback(instance.data.promiseReject);
                } else {
                    instance.data.promiseReject();
                }
            }).modal('hide');
        }

    };
});

Template.dialogForm.onRendered(() => {
    const instance = Template.instance();

    // Allow options ovewrite
    const modalOptions = _.extend({
        backdrop: 'static',
        keyboard: false
    }, instance.data.modalOptions);

    const $modal = instance.$('.modal');

    // Create the bootstrap modal
    $modal.modal(modalOptions);

    const position = instance.data.position;
    if (position) {
        OHIF.ui.repositionDialog($modal, position.x, position.y);
    }
});

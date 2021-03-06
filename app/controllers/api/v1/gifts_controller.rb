class Api::V1::GiftsController < Api::V1::BaseController

  # This controller response with Gift information used with the ajax calls.

  def show
    @gifts = Gift.where(friend_id: params[:id])
    respond_with @gifts
  end

  def create
    @gift = Gift.new(gift_params)
    if @gift.save
      respond_with :api, :v1, @gift
    else
      errors = @gift.errors.full_messages.as_json
      respond_with errors, json: { errors: errors }
    end
  end

  def update
    @gift = Gift.find(params["id"])
    if @gift.update_attributes(gift_params)
      respond_with @gift, json: @gift
    else
      errors = @gift.errors.full_messages.as_json
      respond_with errors, json: { errors: errors }
    end
  end

  def destroy
    respond_with Gift.destroy(params[:id])
  end

  private

  def gift_params
    params.require(:gift).permit(:name, :price, :link, :friend_id)
  end

end